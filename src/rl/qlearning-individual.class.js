import { Individual } from '../individual.class.js'
import { ExperienceBuffer } from './experience-buffer.class.js'

/**
 * Q-Learning Individual
 * Extends Individual with Q-Learning capabilities
 */
export class QLearningIndividual extends Individual {
  constructor(options = {}) {
    super(options)

    const {
      rlConfig = {}
    } = options

    // Q-Learning parameters
    this.learningRate = rlConfig.learningRate || 0.1
    this.discountFactor = rlConfig.discountFactor || 0.95
    this.epsilon = rlConfig.epsilon || 0.1
    this.epsilonDecay = rlConfig.epsilonDecay || 0.995
    this.epsilonMin = rlConfig.epsilonMin || 0.01
    this.useSoftmax = rlConfig.useSoftmax || false
    this.temperature = rlConfig.temperature || 1.0

    // Q-table or Q-network
    this.qTable = new Map()
    this.useNeuralQ = rlConfig.useNeuralQ || false

    // Experience replay
    this.experienceBuffer = new ExperienceBuffer(rlConfig.bufferSize || 10000)
    this.batchSize = rlConfig.batchSize || 32
    this.updateFrequency = rlConfig.updateFrequency || 4
    this.stepCounter = 0

    // State and action tracking
    this.lastState = null
    this.lastAction = null
    this.episodeRewards = []
    this.totalReward = 0

    // Learning mode
    this.learningEnabled = true
    this.explorationEnabled = true
  }

  /**
   * Get Q-value for state-action pair
   */
  getQValue(state, action) {
    if (this.useNeuralQ) {
      return this._getNeuralQValue(state, action)
    }

    const key = this._getStateKey(state)
    if (!this.qTable.has(key)) {
      this.qTable.set(key, new Map())
    }

    const actionValues = this.qTable.get(key)
    if (!actionValues.has(action)) {
      actionValues.set(action, 0)
    }

    return actionValues.get(action)
  }

  /**
   * Set Q-value for state-action pair
   */
  setQValue(state, action, value) {
    if (this.useNeuralQ) {
      return this._updateNeuralQ(state, action, value)
    }

    const key = this._getStateKey(state)
    if (!this.qTable.has(key)) {
      this.qTable.set(key, new Map())
    }

    this.qTable.get(key).set(action, value)
  }

  /**
   * Choose action using epsilon-greedy or softmax policy
   */
  chooseAction(state, availableActions) {
    if (!availableActions || availableActions.length === 0) {
      return null
    }

    // Exploration vs Exploitation
    if (this.explorationEnabled) {
      if (this.useSoftmax) {
        return this._chooseSoftmaxAction(state, availableActions)
      } else if (Math.random() < this.epsilon) {
        // Random exploration
        return availableActions[Math.floor(Math.random() * availableActions.length)]
      }
    }

    // Exploitation: choose best action
    let bestAction = availableActions[0]
    let bestValue = this.getQValue(state, bestAction)

    for (const action of availableActions) {
      const value = this.getQValue(state, action)
      if (value > bestValue) {
        bestValue = value
        bestAction = action
      }
    }

    return bestAction
  }

  /**
   * Choose action using softmax probability distribution
   */
  _chooseSoftmaxAction(state, availableActions) {
    const values = availableActions.map(a => this.getQValue(state, a))
    const expValues = values.map(v => Math.exp(v / this.temperature))
    const sumExp = expValues.reduce((a, b) => a + b, 0)
    const probs = expValues.map(v => v / sumExp)

    const r = Math.random()
    let cumSum = 0

    for (let i = 0; i < probs.length; i++) {
      cumSum += probs[i]
      if (r <= cumSum) {
        return availableActions[i]
      }
    }

    return availableActions[availableActions.length - 1]
  }

  /**
   * Update Q-values based on experience
   */
  learn(state, action, reward, nextState, done = false) {
    if (!this.learningEnabled) return

    // Store experience
    this.experienceBuffer.add({
      state,
      action,
      reward,
      nextState,
      done
    })

    // Update total reward
    this.totalReward += reward
    this.episodeRewards.push(reward)

    // Direct Q-learning update
    if (!this.useNeuralQ || this.stepCounter % this.updateFrequency === 0) {
      this._updateQValue(state, action, reward, nextState, done)
    }

    // Batch learning from experience replay
    if (this.experienceBuffer.size() >= this.batchSize) {
      this._learnFromBatch()
    }

    // Decay epsilon
    if (this.epsilon > this.epsilonMin) {
      this.epsilon *= this.epsilonDecay
    }

    this.stepCounter++
  }

  /**
   * Update Q-value using Q-learning formula
   */
  _updateQValue(state, action, reward, nextState, done) {
    const currentQ = this.getQValue(state, action)

    let targetQ
    if (done) {
      targetQ = reward
    } else {
      const maxNextQ = this._getMaxQValue(nextState)
      targetQ = reward + this.discountFactor * maxNextQ
    }

    const newQ = currentQ + this.learningRate * (targetQ - currentQ)
    this.setQValue(state, action, newQ)

    return Math.abs(targetQ - currentQ) // TD error for prioritized replay
  }

  /**
   * Get maximum Q-value for a state
   */
  _getMaxQValue(state) {
    const key = this._getStateKey(state)
    if (!this.qTable.has(key)) {
      return 0
    }

    const actionValues = this.qTable.get(key)
    if (actionValues.size === 0) {
      return 0
    }

    return Math.max(...actionValues.values())
  }

  /**
   * Learn from batch of experiences
   */
  _learnFromBatch() {
    const batch = this.experienceBuffer.sample(this.batchSize, false)

    for (const exp of batch) {
      this._updateQValue(exp.state, exp.action, exp.reward, exp.nextState, exp.done)
    }
  }

  /**
   * Override tick to integrate Q-learning
   */
  tick() {
    // Get current state from sensors
    const currentState = this._getCurrentState()

    // Choose action based on Q-values
    const availableActions = this._getAvailableActions()
    const action = this.chooseAction(currentState, availableActions)

    // Execute action through parent tick
    const result = super.tick()

    // Learn from previous experience
    if (this.lastState !== null && this.lastAction !== null) {
      const reward = this.getReward ? this.getReward(this.lastAction, result) : 0
      this.learn(this.lastState, this.lastAction, reward, currentState)
    }

    // Update last state and action
    this.lastState = currentState
    this.lastAction = action

    return result
  }

  /**
   * Get current state from sensors
   * Override this in subclass
   */
  _getCurrentState() {
    // Default: concatenate all sensor values
    const sensors = this.brain.vertices.filter(v => v.type === 'sensor')
    return sensors.map(s => s.fn ? s.fn() : 0)
  }

  /**
   * Get available actions
   * Override this in subclass
   */
  _getAvailableActions() {
    // Default: all action indices
    const actions = this.brain.vertices.filter(v => v.type === 'action')
    return Array.from({ length: actions.length }, (_, i) => i)
  }

  /**
   * Convert state to string key for Q-table
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
   * Get Q-value using neural network
   * Uses the existing brain as function approximator
   */
  _getNeuralQValue(state, action) {
    // Set sensor values to state
    const sensors = this.brain.vertices.filter(v => v.type === 'sensor')
    state.forEach((value, i) => {
      if (sensors[i]) {
        sensors[i].value = value
      }
    })

    // Add action as additional input
    if (sensors.length > state.length) {
      sensors[state.length].value = action
    }

    // Forward pass through network
    const result = this.brain.tick()

    // Use first action output as Q-value
    const actions = this.brain.vertices.filter(v => v.type === 'action')
    return actions[0]?.value || 0
  }

  /**
   * Update neural Q-network
   */
  _updateNeuralQ(state, action, targetValue) {
    // This would require backpropagation
    // For now, we'll store in table as fallback
    const key = this._getStateKey(state)
    if (!this.qTable.has(key)) {
      this.qTable.set(key, new Map())
    }
    this.qTable.get(key).set(action, targetValue)
  }

  /**
   * Reset for new episode
   */
  resetEpisode() {
    this.lastState = null
    this.lastAction = null
    this.episodeRewards = []
    this.totalReward = 0
  }

  /**
   * Get learning statistics
   */
  getStats() {
    return {
      epsilon: this.epsilon,
      qTableSize: this.qTable.size,
      bufferSize: this.experienceBuffer.size(),
      totalReward: this.totalReward,
      avgReward: this.episodeRewards.length > 0
        ? this.episodeRewards.reduce((a, b) => a + b, 0) / this.episodeRewards.length
        : 0,
      steps: this.stepCounter
    }
  }

  /**
   * Save Q-table to JSON
   */
  exportQTable() {
    const table = {}
    for (const [state, actions] of this.qTable) {
      table[state] = Object.fromEntries(actions)
    }
    return table
  }

  /**
   * Load Q-table from JSON
   */
  importQTable(table) {
    this.qTable.clear()
    for (const [state, actions] of Object.entries(table)) {
      const actionMap = new Map()
      for (const [action, value] of Object.entries(actions)) {
        // Convert numeric values
        const numValue = typeof value === 'string' ? parseFloat(value) : value
        actionMap.set(action, numValue)
      }
      this.qTable.set(state, actionMap)
    }
  }

  /**
   * Enable/disable learning
   */
  setLearning(enabled) {
    this.learningEnabled = enabled
  }

  /**
   * Enable/disable exploration
   */
  setExploration(enabled) {
    this.explorationEnabled = enabled
  }
}