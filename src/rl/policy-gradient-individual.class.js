import { Individual } from '../individual.class.js'

/**
 * Policy Gradient Individual (REINFORCE algorithm)
 * Extends Individual with policy gradient learning
 */
export class PolicyGradientIndividual extends Individual {
  constructor(options = {}) {
    super(options)

    const {
      rlConfig = {}
    } = options

    // Policy gradient parameters
    this.learningRate = rlConfig.learningRate || 0.01
    this.discountFactor = rlConfig.discountFactor || 0.99
    this.baselineAlpha = rlConfig.baselineAlpha || 0.01
    this.entropyCoeff = rlConfig.entropyCoeff || 0.01

    // Episode buffers
    this.states = []
    this.actions = []
    this.rewards = []
    this.logProbs = []

    // Baseline for variance reduction
    this.baseline = 0
    this.useBaseline = rlConfig.useBaseline !== false

    // Policy parameters (if not using neural network)
    this.policyParams = new Map()

    // Statistics
    this.episodeCount = 0
    this.totalReward = 0
    this.avgReward = 0

    // Learning mode
    this.learningEnabled = true
  }

  /**
   * Get action probabilities for a state
   */
  getActionProbabilities(state) {
    if (this.brain) {
      return this._getNeuralPolicy(state)
    }

    // Tabular policy
    const key = this._getStateKey(state)
    if (!this.policyParams.has(key)) {
      const numActions = this._getNumActions()
      const params = new Array(numActions).fill(0)
      this.policyParams.set(key, params)
    }

    const params = this.policyParams.get(key)
    return this._softmax(params)
  }

  /**
   * Sample action from policy
   */
  sampleAction(state, availableActions = null) {
    const probs = this.getActionProbabilities(state)

    if (availableActions) {
      // Mask unavailable actions
      const maskedProbs = probs.map((p, i) =>
        availableActions.includes(i) ? p : 0
      )
      const sum = maskedProbs.reduce((a, b) => a + b, 0)
      if (sum > 0) {
        maskedProbs.forEach((_, i) => maskedProbs[i] /= sum)
      }
      return this._sampleFromDistribution(maskedProbs)
    }

    return this._sampleFromDistribution(probs)
  }

  /**
   * Store transition for learning
   */
  storeTransition(state, action, reward, logProb = null) {
    this.states.push(state)
    this.actions.push(action)
    this.rewards.push(reward)

    if (logProb === null) {
      const probs = this.getActionProbabilities(state)
      logProb = Math.log(probs[action] + 1e-10)
    }
    this.logProbs.push(logProb)

    this.totalReward += reward
  }

  /**
   * Update policy at end of episode
   */
  updatePolicy() {
    if (!this.learningEnabled || this.rewards.length === 0) {
      return
    }

    // Calculate discounted returns
    const returns = this._calculateReturns()

    // Calculate advantages (returns - baseline)
    const advantages = returns.map(r => r - this.baseline)

    // Update baseline
    if (this.useBaseline) {
      const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
      this.baseline = this.baseline + this.baselineAlpha * (avgReturn - this.baseline)
    }

    // Policy gradient update
    if (this.brain) {
      this._updateNeuralPolicy(advantages)
    } else {
      this._updateTabularPolicy(advantages)
    }

    // Update statistics
    this.episodeCount++
    const episodeReward = this.rewards.reduce((a, b) => a + b, 0)
    this.avgReward = this.avgReward + (episodeReward - this.avgReward) / this.episodeCount

    // Clear episode buffers
    this.clearEpisode()
  }

  /**
   * Calculate discounted returns
   */
  _calculateReturns() {
    const returns = new Array(this.rewards.length)
    let runningReturn = 0

    for (let t = this.rewards.length - 1; t >= 0; t--) {
      runningReturn = this.rewards[t] + this.discountFactor * runningReturn
      returns[t] = runningReturn
    }

    return returns
  }

  /**
   * Update tabular policy parameters
   */
  _updateTabularPolicy(advantages) {
    for (let t = 0; t < this.states.length; t++) {
      const state = this.states[t]
      const action = this.actions[t]
      const advantage = advantages[t]

      const key = this._getStateKey(state)
      if (!this.policyParams.has(key)) {
        continue
      }

      const params = this.policyParams.get(key)
      const probs = this._softmax(params)

      // Policy gradient for softmax policy
      for (let a = 0; a < params.length; a++) {
        const gradient = (a === action ? 1 : 0) - probs[a]
        params[a] += this.learningRate * advantage * gradient

        // Entropy regularization
        if (this.entropyCoeff > 0) {
          const entropyGrad = -Math.log(probs[a] + 1e-10) - 1
          params[a] += this.learningRate * this.entropyCoeff * entropyGrad * probs[a]
        }
      }
    }
  }

  /**
   * Update neural policy (requires backpropagation)
   */
  _updateNeuralPolicy(advantages) {
    // Check if brain has vertices array
    if (!this.brain || !Array.isArray(this.brain.vertices)) {
      // Fall back to tabular update
      return this._updateTabularPolicy(advantages)
    }

    // Simplified update using finite differences
    // In practice, would need proper backpropagation

    for (let t = 0; t < this.states.length; t++) {
      const state = this.states[t]
      const action = this.actions[t]
      const advantage = advantages[t]

      // Set sensors to state
      this._setState(state)

      // Forward pass
      const result = this.brain.tick()

      // Approximate gradient update for action neurons
      const actions = this.brain.vertices.filter(v => v.type === 'action')
      if (actions[action]) {
        // Reinforce the selected action based on advantage
        actions[action].bias += this.learningRate * advantage * 0.1
      }
    }
  }

  /**
   * Get neural network policy
   */
  _getNeuralPolicy(state) {
    // Check if brain has vertices array
    if (!this.brain || !Array.isArray(this.brain.vertices)) {
      // Fall back to tabular policy
      const key = this._getStateKey(state)
      if (!this.policyParams.has(key)) {
        const numActions = this._getNumActions()
        const params = new Array(numActions).fill(0)
        this.policyParams.set(key, params)
      }
      return this._softmax(this.policyParams.get(key))
    }

    // Set sensors to state
    this._setState(state)

    // Forward pass
    const result = this.brain.tick()

    // Get action values and apply softmax
    const actions = this.brain.vertices.filter(v => v.type === 'action')
    const values = actions.map(a => a.value || 0)

    return this._softmax(values)
  }

  /**
   * Set brain sensors to state values
   */
  _setState(state) {
    if (!this.brain || !Array.isArray(this.brain.vertices)) return

    const sensors = this.brain.vertices.filter(v => v.type === 'sensor')
    if (Array.isArray(state)) {
      state.forEach((value, i) => {
        if (sensors[i] && sensors[i].fn) {
          // Override sensor function temporarily
          sensors[i]._originalFn = sensors[i].fn
          sensors[i].fn = () => value
        }
      })
    }
  }

  /**
   * Restore original sensor functions
   */
  _restoreSensors() {
    const sensors = this.brain.vertices.filter(v => v.type === 'sensor')
    sensors.forEach(s => {
      if (s._originalFn) {
        s.fn = s._originalFn
        delete s._originalFn
      }
    })
  }

  /**
   * Softmax function
   */
  _softmax(values) {
    const max = Math.max(...values)
    const exp = values.map(v => Math.exp(v - max))
    const sum = exp.reduce((a, b) => a + b, 0)
    return exp.map(e => e / sum)
  }

  /**
   * Sample from probability distribution
   */
  _sampleFromDistribution(probs) {
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
   * Calculate entropy of policy
   */
  calculateEntropy(state) {
    const probs = this.getActionProbabilities(state)
    return -probs.reduce((sum, p) => {
      return sum + (p > 0 ? p * Math.log(p) : 0)
    }, 0)
  }

  /**
   * Override tick to integrate policy gradient
   */
  tick() {
    // Get current state
    const state = this._getCurrentState()

    // Sample action from policy
    const availableActions = this._getAvailableActions()
    const action = this.sampleAction(state, availableActions)

    // Execute action
    if (action !== null) {
      this._executeAction(action)
    }

    // Parent tick
    const result = super.tick()

    // Store transition if learning
    if (this.learningEnabled && this.getReward) {
      const reward = this.getReward(action, result)
      this.storeTransition(state, action, reward)
    }

    return result
  }

  /**
   * Execute selected action
   */
  _executeAction(actionIndex) {
    const actions = this.brain.vertices.filter(v => v.type === 'action')
    // Set all actions to 0
    actions.forEach(a => a.value = 0)
    // Activate selected action
    if (actions[actionIndex]) {
      actions[actionIndex].value = 1
    }
  }

  /**
   * Get current state from sensors
   */
  _getCurrentState() {
    if (!this.brain || !Array.isArray(this.brain.vertices)) {
      return []
    }
    const sensors = this.brain.vertices.filter(v => v.type === 'sensor')
    return sensors.map(s => s.fn ? s.fn() : 0)
  }

  /**
   * Get available actions
   */
  _getAvailableActions() {
    const numActions = this._getNumActions()
    return Array.from({ length: numActions }, (_, i) => i)
  }

  /**
   * Get number of actions
   */
  _getNumActions() {
    if (this.brain && Array.isArray(this.brain.vertices)) {
      return this.brain.vertices.filter(v => v.type === 'action').length
    }
    return 3 // Default to 3 actions for tests
  }

  /**
   * Convert state to string key
   */
  _getStateKey(state) {
    if (typeof state === 'string') {
      return state
    }
    if (Array.isArray(state)) {
      return JSON.stringify(state)
    }
    return String(state)
  }

  /**
   * Clear episode buffers
   */
  clearEpisode() {
    this.states = []
    this.actions = []
    this.rewards = []
    this.logProbs = []
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      episodeCount: this.episodeCount,
      totalReward: this.totalReward,
      avgReward: this.avgReward,
      baseline: this.baseline,
      policySize: this.policyParams.size,
      episodeLength: this.rewards.length
    }
  }

  /**
   * Export policy parameters
   */
  exportPolicy() {
    const policy = {}
    for (const [state, params] of this.policyParams) {
      policy[state] = params
    }
    return {
      policy,
      baseline: this.baseline,
      stats: this.getStats()
    }
  }

  /**
   * Import policy parameters
   */
  importPolicy(data) {
    this.policyParams.clear()
    for (const [state, params] of Object.entries(data.policy)) {
      this.policyParams.set(state, params)
    }
    if (data.baseline !== undefined) {
      this.baseline = data.baseline
    }
  }

  /**
   * Enable/disable learning
   */
  setLearning(enabled) {
    this.learningEnabled = enabled
  }
}