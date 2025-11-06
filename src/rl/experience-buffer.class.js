/**
 * Experience Buffer for Reinforcement Learning
 * Stores and samples experiences for training
 */
export class ExperienceBuffer {
  constructor(capacity = 10000) {
    this.capacity = capacity
    this.buffer = []
    this.position = 0
    this.priorities = []
    this.epsilon = 0.01
    this.alpha = 0.6
    this.beta = 0.4
    this.betaIncrement = 0.001
  }

  /**
   * Add experience to buffer
   * @param {Object} experience - {state, action, reward, nextState, done}
   * @param {Number} priority - Optional priority for prioritized replay
   */
  add(experience, priority = null) {
    if (priority === null) {
      priority = this.priorities.length > 0 ? Math.max(...this.priorities) : 1
    }

    if (this.buffer.length < this.capacity) {
      this.buffer.push(experience)
      this.priorities.push(priority)
    } else {
      this.buffer[this.position] = experience
      this.priorities[this.position] = priority
    }

    this.position = (this.position + 1) % this.capacity
  }

  /**
   * Sample batch of experiences
   * @param {Number} batchSize - Number of experiences to sample
   * @param {Boolean} prioritized - Use prioritized experience replay
   */
  sample(batchSize, prioritized = false) {
    const n = this.buffer.length

    if (n < batchSize) {
      return this.buffer.slice()
    }

    if (!prioritized) {
      // Uniform random sampling
      const indices = []
      const samples = []

      while (indices.length < batchSize) {
        const idx = Math.floor(Math.random() * n)
        if (!indices.includes(idx)) {
          indices.push(idx)
          samples.push(this.buffer[idx])
        }
      }

      return samples
    }

    // Prioritized sampling
    const samples = []
    const indices = []
    const weights = []

    // Calculate sampling probabilities
    const priorities = this.priorities.slice(0, n)
    const probs = this._calculateProbabilities(priorities)

    // Sample according to priorities
    for (let i = 0; i < batchSize; i++) {
      const idx = this._sampleIndex(probs)
      indices.push(idx)
      samples.push(this.buffer[idx])

      // Calculate importance sampling weight
      const prob = probs[idx]
      const weight = Math.pow(n * prob, -this.beta)
      weights.push(weight)
    }

    // Normalize weights
    const maxWeight = Math.max(...weights)
    const normalizedWeights = weights.map(w => w / maxWeight)

    // Increase beta
    this.beta = Math.min(1, this.beta + this.betaIncrement)

    return samples.map((exp, i) => ({
      ...exp,
      weight: normalizedWeights[i],
      index: indices[i]
    }))
  }

  /**
   * Update priorities for sampled experiences
   * @param {Array} indices - Indices of experiences
   * @param {Array} tdErrors - TD errors for priority update
   */
  updatePriorities(indices, tdErrors) {
    for (let i = 0; i < indices.length; i++) {
      const priority = Math.pow(Math.abs(tdErrors[i]) + this.epsilon, this.alpha)
      this.priorities[indices[i]] = priority
    }
  }

  /**
   * Calculate sampling probabilities from priorities
   */
  _calculateProbabilities(priorities) {
    const sum = priorities.reduce((a, b) => a + Math.pow(b, this.alpha), 0)
    return priorities.map(p => Math.pow(p, this.alpha) / sum)
  }

  /**
   * Sample index according to probabilities
   */
  _sampleIndex(probs) {
    const r = Math.random()
    let cumSum = 0

    for (let i = 0; i < probs.length; i++) {
      cumSum += probs[i]
      if (r <= cumSum) {
        return i
      }
    }

    return probs.length - 1
  }

  /**
   * Get current buffer size
   */
  size() {
    return this.buffer.length
  }

  /**
   * Clear the buffer
   */
  clear() {
    this.buffer = []
    this.priorities = []
    this.position = 0
  }

  /**
   * Get statistics about the buffer
   */
  getStats() {
    if (this.buffer.length === 0) {
      return { size: 0, avgReward: 0, avgPriority: 0 }
    }

    const rewards = this.buffer.map(exp => exp.reward)
    const avgReward = rewards.reduce((a, b) => a + b, 0) / rewards.length
    const avgPriority = this.priorities.slice(0, this.buffer.length)
      .reduce((a, b) => a + b, 0) / this.buffer.length

    return {
      size: this.buffer.length,
      avgReward,
      avgPriority,
      minReward: Math.min(...rewards),
      maxReward: Math.max(...rewards)
    }
  }

  /**
   * Save buffer to JSON
   */
  toJSON() {
    return {
      buffer: this.buffer,
      priorities: this.priorities,
      position: this.position,
      capacity: this.capacity,
      alpha: this.alpha,
      beta: this.beta
    }
  }

  /**
   * Load buffer from JSON
   */
  static fromJSON(json) {
    const buffer = new ExperienceBuffer(json.capacity)
    buffer.buffer = json.buffer
    buffer.priorities = json.priorities
    buffer.position = json.position
    buffer.alpha = json.alpha
    buffer.beta = json.beta
    return buffer
  }
}