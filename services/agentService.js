const geminiService = require('./geminiService');

/**
 * Agent Service Layer
 *
 * This service acts as an agent marketplace interface (Fetch.ai/Agentverse inspired)
 * It wraps the problem generation service and tracks usage as "credits"
 *
 * In a full implementation, this would:
 * - Connect to actual Fetch.ai agent network
 * - Handle agent discovery and service calls
 * - Manage payments/credits in FET tokens
 * - Route requests to different specialized agents
 */
class AgentService {
  constructor() {
    this.agentMetrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      totalCreditsIssued: 0
    };

    // Simulated agent registry
    this.agents = {
      'problem-generator': {
        name: 'Problem Generator Agent',
        description: 'Generates algorithmic coding problems',
        creditCost: 1,
        provider: 'Gemini AI',
        status: 'active'
      },
      'code-evaluator': {
        name: 'Code Evaluator Agent',
        description: 'Evaluates code submissions and provides feedback',
        creditCost: 1,
        provider: 'Gemini AI',
        status: 'active'
      }
    };
  }

  /**
   * Request a problem from the Problem Generator Agent
   * This simulates an agent service call in the Fetch.ai ecosystem
   */
  async requestProblemFromAgent(pattern, difficulty, userId) {
    const startTime = Date.now();
    this.agentMetrics.totalRequests++;

    try {
      console.log(`[Agent Service] User ${userId} requesting problem via Problem Generator Agent`);
      console.log(`[Agent Service] Pattern: ${pattern}, Difficulty: ${difficulty}`);
      console.log(`[Agent Service] Cost: ${this.agents['problem-generator'].creditCost} credit(s)`);

      // Call the actual problem generation service
      const result = await geminiService.generateProblem(pattern, difficulty);

      // Track metrics
      const responseTime = Date.now() - startTime;
      this.updateMetrics(true, responseTime, this.agents['problem-generator'].creditCost);

      console.log(`[Agent Service] Problem generated successfully in ${responseTime}ms`);

      return {
        success: true,
        problem: result.problem,
        credits_used: this.agents['problem-generator'].creditCost,
        agent_info: {
          agent_name: this.agents['problem-generator'].name,
          response_time_ms: responseTime
        }
      };

    } catch (error) {
      this.agentMetrics.failedRequests++;
      console.error(`[Agent Service] Problem generation failed:`, error);

      return {
        success: false,
        error: error.message,
        credits_used: 0,
        agent_info: {
          agent_name: this.agents['problem-generator'].name,
          error: 'Agent request failed'
        }
      };
    }
  }

  /**
   * Request code evaluation from the Code Evaluator Agent
   */
  async requestEvaluationFromAgent(code, pattern, problemDescription, userId) {
    const startTime = Date.now();
    this.agentMetrics.totalRequests++;

    try {
      console.log(`[Agent Service] User ${userId} requesting evaluation via Code Evaluator Agent`);
      console.log(`[Agent Service] Pattern: ${pattern}`);
      console.log(`[Agent Service] Cost: ${this.agents['code-evaluator'].creditCost} credit(s)`);

      // Call the actual evaluation service
      const result = await geminiService.evaluateCode(code, pattern, problemDescription);

      // Track metrics
      const responseTime = Date.now() - startTime;
      this.updateMetrics(true, responseTime, this.agents['code-evaluator'].creditCost);

      console.log(`[Agent Service] Evaluation completed successfully in ${responseTime}ms`);

      return {
        success: true,
        evaluation: result.evaluation,
        credits_used: this.agents['code-evaluator'].creditCost,
        agent_info: {
          agent_name: this.agents['code-evaluator'].name,
          response_time_ms: responseTime
        }
      };

    } catch (error) {
      this.agentMetrics.failedRequests++;
      console.error(`[Agent Service] Code evaluation failed:`, error);

      return {
        success: false,
        error: error.message,
        credits_used: 0,
        agent_info: {
          agent_name: this.agents['code-evaluator'].name,
          error: 'Agent request failed'
        }
      };
    }
  }

  updateMetrics(success, responseTime, credits) {
    if (success) {
      this.agentMetrics.successfulRequests++;
      this.agentMetrics.totalCreditsIssued += credits;

      // Update average response time
      const totalRequests = this.agentMetrics.successfulRequests;
      const currentAvg = this.agentMetrics.averageResponseTime;
      this.agentMetrics.averageResponseTime =
        (currentAvg * (totalRequests - 1) + responseTime) / totalRequests;
    }
  }

  getAgentMetrics() {
    return {
      ...this.agentMetrics,
      successRate: this.agentMetrics.totalRequests > 0
        ? ((this.agentMetrics.successfulRequests / this.agentMetrics.totalRequests) * 100).toFixed(2)
        : 0
    };
  }

  getAvailableAgents() {
    return this.agents;
  }
}

module.exports = new AgentService();
