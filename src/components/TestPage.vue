<template>
  <div class="test-page">
    <!-- 漂浮爱心动画容器 -->
    <div class="floating-hearts"></div>
    <!-- 云朵装饰 -->
    <div class="cloud-decoration cloud-1"></div>
    <div class="cloud-decoration cloud-2"></div>
    <div class="cloud-decoration cloud-3"></div>
    <button class="back-button" @click="goBack">
      <font-awesome-icon icon="arrow-left" class="back-icon" />
      返回
    </button>
    
    <div class="test-container">
      <div v-if="!showQuiz && !showResults" class="illustration">
        <div class="box">
          <img src="@/assets/img/透明背景爱心.png" alt="爱心" class="heart-image">
          <h1 class="test-title">请问你具体需要哪一个类型的测试呢？</h1>
        </div>
      </div>
      
      <!-- 测试类型选择界面 -->
      <div v-if="!showQuiz && !showResults" class="test-buttons">
        <button class="test-button" @click="startQuiz('general')">
          <font-awesome-icon icon="brain" class="button-icon" />
          普遍心理现象
        </button>
        <button class="test-button" @click="startQuiz('emotional')">
          <font-awesome-icon icon="heart" class="button-icon" />
          情感障碍
        </button>
        <button class="test-button" @click="startQuiz('mental')">
          <font-awesome-icon icon="stethoscope" class="button-icon" />
          精神心理疾病
        </button>
      </div>
      
      <!-- 测试答题界面 -->
      <div v-if="showQuiz" class="quiz-container">
        <div class="question">{{ currentQuestion }}</div>
        <div class="options">
          <button class="option-button" @click="answerQuestion(0)">从不</button>
          <button class="option-button" @click="answerQuestion(1)">偶尔</button>
          <button class="option-button" @click="answerQuestion(2)">经常</button>
          <button class="option-button" @click="answerQuestion(3)">总是</button>
        </div>
        <div class="quiz-progress">
          <p>问题 {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</p>
          <progress class="progress-bar" :value="currentQuestionIndex + 1" :max="totalQuestions"></progress>
        </div>
      </div>
      
      <!-- 测试结果界面 -->
      <div v-if="showResults" class="results-container">
        <h2>评估结果</h2>
        <div class="result-item" v-for="(result, index) in results" :key="index">
          <h3>{{ result.name }}：<span :class="getRiskLevelClass(result.riskLevel)">{{ result.riskLevel }}</span></h3>
          <p>得分：{{ result.score }}/{{ result.maxScore }}</p>
          <h4>自我调节建议：</h4>
          <ul>
            <li v-for="(tip, tipIndex) in result.tips" :key="tipIndex">{{ tip }}</li>
          </ul>
        </div>
        <div class="disclaimer">
          <p>请注意：这只是一个初步的自我评估工具，不能替代专业的心理健康诊断。如果您对自己的心理健康状况有任何担忧，请务必咨询专业的心理健康工作者。</p>
          <p>祝你们大家天天开心，不被心理疾病困扰。</p>
        </div>
        <button class="restart-button" @click="restartQuiz">重新开始</button>
      </div>
      
      <div v-if="!showQuiz && !showResults" class="test-descriptions">
        <div class="description">
          <div class="description-header">
            <font-awesome-icon icon="brain" class="description-icon" />
            <h3>普遍心理现象</h3>
          </div>
          <p>是指在大多数人身上都会出现的、具有共性的心理活动和行为倾向，它们受生理、社会、认知等多方面因素影响如：从众效应，认知失调，刻板印象</p>
        </div>
        <div class="description">
          <div class="description-header">
            <font-awesome-icon icon="heart" class="description-icon" />
            <h3>情感障碍</h3>
          </div>
          <p>情感障碍是一类以情绪／心境异常为核心症状的精神障碍，其情绪波动远超正常的喜怒哀乐，持续时间长、影响社会功能如：抑郁症，双相情感障碍，季节性情感障碍</p>
        </div>
        <div class="description">
          <div class="description-header">
            <font-awesome-icon icon="stethoscope" class="description-icon" />
            <h3>精神心理疾病</h3>
          </div>
          <p>精神心理疾病是一类以认知、情绪、行为或人际关系显著异常为核心特征的疾病总称其本质是大脑功能（神经递质、神经回路、大脑结构等）异常与心理、社会环境因素共同作用的结果。如：精神分裂，分裂情感性障碍，社交焦虑障碍，强迫症，边缘型人格障碍</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestPage',
  data() {
    return {
      selectedType: null,
      isLoading: false,
      // 测试相关数据
      showQuiz: false,
      showResults: false,
      currentCategory: '',
      currentQuestionIndex: 0,
      scores: {},
      results: [],
      // 题库数据
      categories: {
        general: {
          name: "普遍心理现象",
          questions: [
            "我经常感到压力和焦虑",
            "我对未来感到乐观",
            "我容易受到他人情绪的影响",
            "我经常反思自己的行为和想法",
            "我能够有效地管理自己的时间",
            "我对生活中的小事感到满足",
            "我经常感到孤独",
            "我能够轻松地与他人建立关系",
            "我对自己的外表感到满意",
            "我经常感到疲劳或缺乏精力",
            "我能够有效地处理压力",
            "我经常感到无聊或缺乏动力",
            "我对自己的能力有信心",
            "我经常感到内疚或后悔",
            "我能够控制自己的情绪",
            "我经常担心未来",
            "我能够从失败中学习并成长",
            "我经常感到被误解或不被理解",
            "我对生活有明确的目标和方向",
            "我能够在困难时期保持积极态度",
            "我容易因为小事而生气或烦躁",
            "我能够接受自己的不完美",
            "我经常与他人比较，感到不满足",
            "我能够专注于当下，不过度担忧",
            "我有良好的睡眠质量",
            "我能够表达自己的需求和感受",
            "我经常感到被他人评判",
            "我能够享受独处的时光",
            "我对新事物持开放态度",
            "我能够原谅他人的过错",
            "我经常感到时间不够用",
            "我能够设定并坚持个人边界",
            "我对自己的成就感到自豪",
            "我能够接受批评而不感到受伤",
            "我经常感到生活有意义",
            "我能够适应变化和新环境",
            "我有健康的应对压力的方式",
            "我能够欣赏生活中的美好",
            "我经常感到与他人有连接感",
            "我能够平衡工作与生活"
          ],
          assessments: [
            { name: "压力管理", maxScore: 30, tips: [
              "学习并练习放松技巧，如深呼吸或冥想",
              "建立规律的运动习惯",
              "保持充足的睡眠",
              "学会说\"不\"，避免过度承诺",
              "培养健康的兴趣爱好",
              "学习时间管理技巧"
            ]},
            { name: "自我认知", maxScore: 30, tips: [
              "每天花时间进行自我反思",
              "尝试写日记来整理思绪和感受",
              "寻求他人的反馈，以获得不同的视角",
              "设定个人成长目标并定期评估进展",
              "学习接受自己的优点和缺点",
              "培养成长型思维模式"
            ]},
            { name: "情绪智力", maxScore: 30, tips: [
              "学习识别和命名自己的情绪",
              "练习同理心，尝试理解他人的感受",
              "在表达情绪之前，先深呼吸并思考",
              "寻找健康的方式来表达和释放情绪",
              "学习情绪调节技巧",
              "培养积极的自我对话"
            ]},
            { name: "社交能力", maxScore: 30, tips: [
              "主动参与社交活动，扩大社交圈",
              "练习积极倾听的技巧",
              "学习非语言沟通，如身体语言和面部表情",
              "培养同理心，尝试从他人的角度思考问题",
              "学习冲突解决技巧",
              "建立和维护支持性的人际关系"
            ]},
            { name: "生活满意度", maxScore: 30, tips: [
              "每天记录感恩的事情",
              "培养正念和当下的意识",
              "设定有意义的生活目标",
              "寻找生活的意义和目的",
              "培养乐观的生活态度",
              "学会欣赏生活中的小确幸"
            ]},
            { name: "适应能力", maxScore: 30, tips: [
              "培养灵活性和开放心态",
              "学习应对变化的策略",
              "建立应对挑战的韧性",
              "寻求社会支持",
              "保持学习和成长的心态",
              "培养解决问题的能力"
            ]}
          ]
        },
        emotional: {
          name: "情感障碍",
          questions: [
            "我经常感到情绪低落或沮丧",
            "我对以前喜欢的活动失去了兴趣",
            "我的睡眠模式发生了显著变化（睡太多或太少）",
            "我的食欲发生了显著变化（吃太多或太少）",
            "我感到疲劳或缺乏精力",
            "我感到自己毫无价值或过度内疚",
            "我难以集中注意力或做决定",
            "我有自杀的想法",
            "我感到焦虑或紧张",
            "我经历过突然的恐慌发作",
            "我避免某些引起焦虑的情况或地方",
            "我有特定的恐惧（如害怕高处、密闭空间等）",
            "我的情绪波动很大",
            "我有时感到异常兴奋或精力充沛",
            "我做事冲动，不考虑后果",
            "我有强迫性的想法或行为",
            "我经历过创伤事件后的持续困扰",
            "我有反复出现的噩梦或闪回",
            "我对人际关系感到困难或疏离",
            "我经常感到愤怒或易怒",
            "我感到绝望，看不到未来",
            "我对自己的身体形象感到不满意",
            "我有过度的担忧和恐惧",
            "我感到内心空虚或麻木",
            "我有自伤的行为或想法",
            "我难以体验到快乐或满足感",
            "我感到被情绪所控制",
            "我有过度的完美主义倾向",
            "我感到社交场合极度不适",
            "我有强烈的被抛弃恐惧",
            "我难以调节自己的情绪反应",
            "我感到生活没有希望",
            "我有过度的责任感或罪恶感",
            "我感到与他人的情感连接困难",
            "我有过度敏感或容易受伤",
            "我感到内心有强烈的冲突",
            "我有难以控制的冲动行为",
            "我感到情绪反应与情境不符",
            "我有过度依赖他人的倾向",
            "我感到自己是个负担"
          ],
          assessments: [
            { name: "抑郁症状", maxScore: 48, tips: [
              "建立规律的日常作息",
              "尝试轻度运动，如散步",
              "与信任的人分享你的感受",
              "考虑寻求专业的心理治疗或咨询",
              "学习认知行为疗法技巧",
              "培养积极的自我对话",
              "设定小而可实现的目标",
              "避免孤立自己，保持社交联系"
            ]},
            { name: "焦虑症状", maxScore: 48, tips: [
              "学习并练习放松技巧，如深呼吸或冥想",
              "逐步面对引发焦虑的情况",
              "限制咖啡因和酒精的摄入",
              "保持规律的睡眠习惯",
              "学习正念减压技巧",
              "练习渐进式肌肉放松",
              "寻求认知行为治疗",
              "建立健康的应对机制"
            ]},
            { name: "双相情感障碍症状", maxScore: 24, tips: [
              "保持规律的作息时间",
              "避免使用酒精和药物",
              "学习识别情绪变化的早期警告信号",
              "定期与心理健康专业人士沟通",
              "建立情绪监测日记",
              "学习压力管理技巧",
              "保持稳定的日常生活",
              "寻求家庭支持和教育"
            ]},
            { name: "创伤相关症状", maxScore: 24, tips: [
              "寻求专业的心理创伤治疗",
              "学习 grounding 技巧来应对闪回",
              "建立安全感的环境",
              "练习自我安抚技巧",
              "考虑眼动脱敏与再加工治疗",
              "加入支持小组",
              "学习情绪调节技巧",
              "建立健康的边界"
            ]},
            { name: "人际关系困难", maxScore: 24, tips: [
              "学习有效的沟通技巧",
              "练习设定健康的边界",
              "寻求人际关系治疗",
              "培养自我同情和自我接纳",
              "学习冲突解决技巧",
              "建立支持性的社交网络",
              "练习情感表达",
              "考虑团体治疗"
            ]},
            { name: "情绪调节困难", maxScore: 24, tips: [
              "学习辩证行为疗法技巧",
              "练习正念和觉察",
              "建立情绪调节策略",
              "学习忍受痛苦的技巧",
              "培养自我安抚能力",
              "寻求专业的心理治疗",
              "练习情绪识别和命名",
              "建立健康的应对机制"
            ]}
          ]
        },
        mental: {
          name: "精神心理疾病",
          questions: [
            "我听到或看到其他人没有的东西（如幻听、幻视）",
            "我有一些奇怪或不寻常的想法（如被控制、被监视）",
            "我感觉有人在监视或跟踪我",
            "我的思维似乎变得混乱或不连贯",
            "我感到与现实脱节（如感觉世界不真实）",
            "我有强烈的自杀想法或计划",
            "我有伤害自己或他人的冲动",
            "我感到极度兴奋，几天不需要睡觉",
            "我的情绪和能量水平有极端的起伏",
            "我有无法控制的强迫想法或行为",
            "我经历过创伤后有持续的噩梦或闪回",
            "我对某些事物有强烈的恐惧，影响了日常生活",
            "我有严重的饮食问题（暴食、节食或催吐）",
            "我使用药物或酒精来应对情绪问题",
            "我的人格似乎经常变化",
            "我有严重的记忆问题或记忆空白",
            "我感到与自己的身体或周围环境分离（人格解体）",
            "我有反复出现的自杀想法",
            "我感到极度孤立和与他人疏离",
            "我的情绪或行为严重影响了我的工作或学习",
            "我有过度的猜疑，认为他人对我不利",
            "我有无法控制的冲动行为",
            "我感到自己的思想被他人读取或广播",
            "我有严重的注意力缺陷，无法集中注意力",
            "我感到极度的恐惧和恐慌，没有明显原因",
            "我有严重的社交退缩，避免所有人际接触",
            "我感到自己的身体或外貌发生了奇怪的变化",
            "我有无法解释的身体症状（如疼痛、麻木）",
            "我感到时间感扭曲，时间流逝异常",
            "我有严重的自我伤害行为",
            "我感到被某种力量或存在控制",
            "我有严重的睡眠障碍（失眠或过度睡眠）",
            "我感到极度的内疚或无价值感",
            "我有严重的强迫性仪式行为",
            "我感到无法信任任何人",
            "我有严重的情绪波动，从极度兴奋到深度抑郁",
            "我感到自己的身份或自我感丧失",
            "我有严重的回避行为，无法面对日常活动",
            "我感到极度的焦虑，无法放松",
            "我有严重的认知功能下降，无法完成简单任务"
          ],
          assessments: [
            { name: "精神病性症状", maxScore: 30, tips: [
              "立即寻求专业的精神科帮助",
              "保持规律的日常作息",
              "避免使用酒精和药物",
              "与信任的人保持联系",
              "遵循医生的药物治疗方案",
              "参加心理社会康复项目",
              "学习识别早期症状",
              "建立危机应对计划"
            ]},
            { name: "情感障碍", maxScore: 30, tips: [
              "寻求专业的心理健康评估",
              "学习情绪管理技巧",
              "建立支持性的社交网络",
              "保持规律的睡眠和饮食习惯",
              "考虑药物治疗",
              "参加心理治疗",
              "监测情绪变化",
              "建立健康的生活方式"
            ]},
            { name: "焦虑与强迫症状", maxScore: 30, tips: [
              "学习并练习放松技巧",
              "逐步面对引发焦虑的情况",
              "考虑认知行为治疗",
              "限制咖啡因和酒精的摄入",
              "学习暴露与反应预防技巧",
              "练习正念冥想",
              "建立规律的运动习惯",
              "寻求专业的心理治疗"
            ]},
            { name: "创伤与解离症状", maxScore: 30, tips: [
              "寻求专业的心理创伤治疗",
              "学习 grounding 技巧",
              "建立安全感的环境",
              "练习自我安抚技巧",
              "考虑眼动脱敏与再加工治疗",
              "加入支持小组",
              "学习情绪调节技巧",
              "建立健康的边界"
            ]},
            { name: "自杀与自伤风险", maxScore: 30, tips: [
              "立即寻求紧急专业帮助",
              "建立安全计划",
              "移除可能的自伤工具",
              "与信任的人保持联系",
              "学习危机应对技巧",
              "参加心理治疗",
              "建立支持网络",
              "学习情绪调节技巧"
            ]},
            { name: "功能损害", maxScore: 30, tips: [
              "寻求专业的心理健康评估",
              "建立结构化的日常生活",
              "设定小而可实现的目标",
              "寻求职业康复服务",
              "建立社会支持网络",
              "学习应对技巧",
              "考虑家庭治疗",
              "保持耐心和坚持"
            ]}
          ]
        }
      }
    };
  },
  computed: {
    currentQuestion() {
      if (!this.currentCategory || this.currentQuestionIndex >= this.totalQuestions) {
        return '';
      }
      return this.categories[this.currentCategory].questions[this.currentQuestionIndex];
    },
    totalQuestions() {
      if (!this.currentCategory) {
        return 0;
      }
      return this.categories[this.currentCategory].questions.length;
    }
  },
  mounted() {
    this.initFloatingHearts();
  },
  beforeUnmount() {
    if (this.heartInterval) clearInterval(this.heartInterval);
  },
  methods: {
    initFloatingHearts() {
      const container = document.querySelector('.floating-hearts');
      if (!container) return;
      let heartCount = 0;
      const createHeart = () => {
        if (heartCount >= 4) return;
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.style.left = Math.random() * 100 + 'vw';
        const size = 10 + Math.random() * 8;
        heart.style.width = heart.style.height = size + 'px';
        heart.style.opacity = 0.5 + Math.random() * 0.25;
        heart.style.animation = `floatUp ${9 + Math.random() * 4}s ease-in-out forwards`;
        heart.style.willChange = 'transform, opacity';
        container.appendChild(heart);
        heartCount++;
        setTimeout(() => { heart.remove(); heartCount--; }, 14000);
      };
      this.heartInterval = setInterval(createHeart, 3200);
    },
    goBack() {
      this.$router.back();
    },
    startQuiz(category) {
      this.currentCategory = category;
      this.currentQuestionIndex = 0;
      this.scores = {};
      this.showQuiz = true;
      this.showResults = false;
      
      // 初始化分数
      this.categories[category].assessments.forEach(assessment => {
        this.scores[assessment.name] = 0;
      });
    },
    answerQuestion(score) {
      // 根据题目索引分配到对应的评估维度
      const assessmentCount = this.categories[this.currentCategory].assessments.length;
      const questionsPerAssessment = Math.ceil(this.totalQuestions / assessmentCount);
      const assessmentIndex = Math.min(Math.floor(this.currentQuestionIndex / questionsPerAssessment), assessmentCount - 1);
      const assessmentName = this.categories[this.currentCategory].assessments[assessmentIndex].name;
      this.scores[assessmentName] += score;
      
      this.currentQuestionIndex++;
      
      if (this.currentQuestionIndex >= this.totalQuestions) {
        this.calculateResults();
      }
    },
    calculateResults() {
      this.results = [];
      
      this.categories[this.currentCategory].assessments.forEach(assessment => {
        const score = this.scores[assessment.name];
        const percentage = (score / assessment.maxScore) * 100;
        let riskLevel;
        
        if (percentage < 25) {
          riskLevel = "低风险";
        } else if (percentage < 50) {
          riskLevel = "中等风险";
        } else {
          riskLevel = "高风险";
        }
        
        this.results.push({
          name: assessment.name,
          score: score,
          maxScore: assessment.maxScore,
          riskLevel: riskLevel,
          tips: assessment.tips
        });
      });
      
      this.showQuiz = false;
      this.showResults = true;
    },
    restartQuiz() {
      this.showQuiz = false;
      this.showResults = false;
      this.currentCategory = '';
      this.currentQuestionIndex = 0;
      this.scores = {};
      this.results = [];
    },
    getRiskLevelClass(riskLevel) {
      switch(riskLevel) {
        case '低风险':
          return 'risk-low';
        case '中等风险':
          return 'risk-medium';
        case '高风险':
          return 'risk-high';
        default:
          return '';
      }
    }
  }
}
</script>

<style scoped>
.test-page {
  padding: 20px;
  background-color: var(--background-color);
  min-height: 100vh;
  font-family: 'YouSheShaYuFeiTe', Arial, sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* 漂浮爱心动画容器 */
.floating-hearts {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.floating-heart {
  position: fixed;
  bottom: -50px;
  width: 20px;
  height: 20px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff9776'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") no-repeat center/contain;
  pointer-events: none;
  z-index: 9999;
}

@keyframes floatUp {
  0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
}

/* 云朵装饰（纯 CSS 造型） */
.cloud-decoration {
  position: fixed;
  width: 96px;
  height: 30px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(233, 243, 255, 0.7));
  opacity: 0.75;
  pointer-events: none;
  z-index: 1;
  filter: drop-shadow(0 8px 16px rgba(43, 113, 234, 0.10));
  animation: floatCloud 22s ease-in-out infinite;
}

.cloud-decoration::before,
.cloud-decoration::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: inherit;
}

.cloud-decoration::before {
  width: 40px;
  height: 40px;
  top: -20px;
  left: 18px;
}

.cloud-decoration::after {
  width: 28px;
  height: 28px;
  top: -14px;
  right: 20px;
}

.cloud-1 {
  top: 12%;
  left: 5%;
  animation-delay: 0s;
}

.cloud-2 {
  top: 22%;
  right: 8%;
  transform: scale(0.75);
  animation-delay: 5s;
}

.cloud-3 {
  top: 60%;
  left: 12%;
  transform: scale(0.55);
  animation-delay: 10s;
}

@keyframes floatCloud {
  0%, 100% { translate: 0 0; }
  50% { translate: 15px -20px; }
}

.back-button {
  background-color: var(--white);
  border: 2px solid var(--primary-color);
  border-radius: 25px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-color);
  color: var(--primary-color);
  font-family: 'YouSheShaYuFeiTe', Arial, sans-serif;
}

.back-button:hover {
  background-color: var(--primary-color);
  color: var(--white);
  transform: translateX(-5px);
  box-shadow: 0 8px 20px rgba(43, 113, 234, 0.3);
}

.back-icon {
  font-size: 16px;
  color: inherit;
}

.test-container {
  background-color: var(--white);
  border-radius: 25px;
  padding: 40px;
  box-shadow: 0 2px 12px var(--shadow-color);
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 3;
}

.illustration {
  margin-bottom: 30px;
}

.heart-image {
  width: 200px;
  animation: heartFloat 3s ease-in-out infinite;
}

@keyframes heartFloat {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

.test-title {
  color: var(--primary-color);
  margin: 0;
}

.test-buttons {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
  gap: 20px;
  flex-wrap: wrap;
}

.test-button {
  background: linear-gradient(135deg, #2b71ea 0%, #43B0FA 100%);
  border: none;
  border-radius: 25px;
  padding: 15px 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(43, 113, 234, 0.3);
  position: relative;
  overflow: hidden;
  color: var(--white);
  font-family: 'YouSheShaYuFeiTe', Arial, sans-serif;
}

.test-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(43, 113, 234, 0.4);
}

.test-button:active {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(43, 113, 234, 0.3);
}

.button-icon {
  font-size: 20px;
  color: var(--white);
  transition: transform 0.3s ease;
}

.test-button:hover .button-icon {
  transform: scale(1.2);
}

.test-descriptions {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 50px;
  animation: fadeInUp 0.8s ease-out;
}

.description {
  padding: 20px;
  border-radius: 20px;
  background-color: rgba(43, 113, 234, 0.05);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.description:hover {
  background-color: rgba(43, 113, 234, 0.1);
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(43, 113, 234, 0.2);
  border-left-color: #2b71ea;
}

.description-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.description-icon {
  font-size: 24px;
  color: #2b71ea;
  transition: transform 0.3s ease;
}

.description:hover .description-icon {
  transform: scale(1.1) rotate(10deg);
}

.description h3 {
  font-size: 18px;
  margin: 0;
  color: #333;
  font-weight: 600;
}

.description p {
  font-size: 14px;
  line-height: 1.7;
  color: #666;
  margin: 0;
  transition: color 0.3s ease;
}

.description:hover p {
  color: #475569;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
.box{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 40px;
    border-radius: 30px;
    background: linear-gradient(135deg, rgba(43, 113, 234, 0.1) 0%, rgba(255, 107, 129, 0.1) 100%);
    flex-direction: column;
}

/* 测试答题界面样式 */
.quiz-container {
  margin-bottom: 40px;
  padding: 30px;
  border-radius: 25px;
  border: 2px solid rgba(43, 113, 234, 0.2);
  background-color: rgba(43, 113, 234, 0.02);
}

.question {
  font-size: 1.3em;
  margin-bottom: 30px;
  text-align: center;
  color: #333;
  font-weight: 600;
  position: relative;
  padding: 0 30px;
}

.question::before,
.question::after {
  content: '';
  position: absolute;
  top: 0.45em;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.question::before {
  left: 0;
  background: rgba(43, 113, 234, 0.35);
}

.question::after {
  right: 0;
  background: rgba(255, 107, 129, 0.35);
}

.options {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  gap: 15px;
  flex-wrap: wrap;
}

.option-button {
  background: linear-gradient(135deg, #2b71ea 0%, #43B0FA 100%);
  border: none;
  border-radius: 25px;
  padding: 15px 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 120px;
  color: var(--white);
  box-shadow: 0 4px 15px rgba(43, 113, 234, 0.2);
  font-family: 'YouSheShaYuFeiTe', Arial, sans-serif;
}

.option-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(43, 113, 234, 0.2);
}

.option-button:active {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(43, 113, 234, 0.3);
}

.quiz-progress {
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background-color: #e0e0e0;
  margin-top: 10px;
  border: none;
  overflow: hidden;
}

.progress-bar::-webkit-progress-bar {
  background-color: #e0e0e0;
  border-radius: 5px;
}

.progress-bar::-webkit-progress-value {
  background: linear-gradient(90deg, #2b71ea, #43B0FA);
  border-radius: 5px;
  transition: width 0.3s ease;
}

.progress-bar::-moz-progress-bar {
  background: linear-gradient(90deg, #2b71ea, #43B0FA);
  border-radius: 5px;
}

/* 测试结果界面样式 */
.results-container {
  margin-bottom: 40px;
}

.results-container h2 {
  color: var(--primary-color);
  margin-bottom: 30px;
  font-size: 1.8em;
}

.result-item {
  background-color: rgba(43, 113, 234, 0.05);
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  border-left: 4px solid #2b71ea;
}

.result-item:hover {
  background-color: rgba(43, 113, 234, 0.1);
  transform: translateX(10px);
  box-shadow: 0 5px 15px rgba(43, 113, 234, 0.15);
}

.result-item h3 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 1.4em;
}

.result-item p {
  color: #666;
  margin: 0 0 15px 0;
  font-size: 1.1em;
}

.result-item h4 {
  color: #4b5563;
  margin: 0 0 10px 0;
  font-size: 1.2em;
}

.result-item ul {
  margin: 0;
  padding-left: 20px;
  color: #666;
  line-height: 1.7;
}

.risk-low {
  color: #22c55e;
  font-weight: bold;
}

.risk-medium {
  color: #f59e0b;
  font-weight: bold;
}

.risk-high {
  color: #ef4444;
  font-weight: bold;
}

.disclaimer {
  background-color: rgba(255, 107, 129, 0.08);
  border: 1px solid rgba(255, 107, 129, 0.3);
  border-radius: 12px;
  padding: 15px;
  margin: 30px 0;
  color: #444;
  font-size: 0.95em;
  line-height: 1.7;
}

.restart-button {
  background: linear-gradient(135deg, #2b71ea 0%, #43B0FA 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 15px 30px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(43, 113, 234, 0.3);
  font-family: 'YouSheShaYuFeiTe', Arial, sans-serif;
}

.restart-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(43, 113, 234, 0.4);
}

/* 响应式设计 - 平板设备 */
@media (max-width: 1024px) {
  .test-page {
    padding: 80px 20px 20px;
  }
  
  .test-container {
    padding: 30px 20px;
  }
  
  .heart-image {
    width: 150px;
  }
  
  .test-title {
    font-size: 1.5rem;
  }
  
  .test-buttons {
    gap: 15px;
  }
  
  .test-button {
    padding: 12px 20px;
    font-size: 14px;
    min-width: 160px;
  }
  
  .question {
    font-size: 1.1em;
  }
  
  .option-button {
    padding: 12px 20px;
    font-size: 14px;
    min-width: 100px;
  }
}

/* 响应式设计 - 手机设备 */
@media (max-width: 768px) {
  .test-page {
    padding: 70px 15px 15px;
  }
  
  .back-button {
    top: 15px;
    left: 15px;
    padding: 8px 15px;
    font-size: 14px;
  }
  
  .test-container {
    padding: 20px 15px;
  }
  
  .heart-image {
    width: 120px;
  }
  
  .test-title {
    font-size: 1.25rem;
  }
  
  .test-buttons {
    flex-direction: column;
    gap: 12px;
  }
  
  .test-button {
    padding: 15px 20px;
    font-size: 14px;
    min-width: 100%;
  }
  
  .quiz-container {
    padding: 15px 10px;
  }

  .question {
    font-size: 1em;
    margin-bottom: 20px;
    padding: 0 20px;
  }
  
  .options {
    flex-direction: column;
    gap: 10px;
  }
  
  .option-button {
    padding: 12px 15px;
    font-size: 14px;
    min-width: 100%;
  }
  
  .results-container h2 {
    font-size: 1.5em;
  }
  
  .result-item {
    padding: 15px;
  }
  
  .result-item h3 {
    font-size: 1.2em;
  }
  
  .result-item p {
    font-size: 1em;
  }
  
  .disclaimer {
    padding: 12px;
    font-size: 0.85em;
  }
  
  .restart-button {
    padding: 12px 25px;
    font-size: 14px;
  }
}

/* 响应式设计 - 小屏手机设备 */
@media (max-width: 480px) {
  .test-page {
    padding: 60px 10px 10px;
  }
  
  .back-button {
    top: 10px;
    left: 10px;
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .test-container {
    padding: 15px 10px;
  }
  
  .heart-image {
    width: 100px;
  }
  
  .test-title {
    font-size: 1.1rem;
  }
  
  .test-button {
    padding: 12px 15px;
    font-size: 13px;
  }
  
  .question {
    font-size: 0.95em;
  }
  
  .option-button {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .results-container h2 {
    font-size: 1.3em;
  }
  
  .result-item h3 {
    font-size: 1.1em;
  }
  
  .result-item p {
    font-size: 0.9em;
  }
}
</style>