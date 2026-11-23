import type { Scale } from './types'

// 量表均选用公开发表、具有良好信效度的临床常用工具
// PHQ-9 / GAD-7 为公域量表；PSS 与 UCLA-3 为学术授权常用版本
export const scales: Scale[] = [
  {
    id: 'phq9',
    name: '抑郁症状自评量表',
    shortName: 'PHQ-9',
    category: '情绪',
    description:
      '过去两周里，你有多经常被以下问题困扰？它不能代替诊断，但可以帮你看见自己近期的情绪状态。',
    evidence:
      'Kroenke 等 (2001) 发表于 JGIM，Cronbach α = 0.89，广泛用于抑郁症状筛查与严重程度分级。',
    duration: '约 3 分钟',
    maxScore: 27,
    theme: 'mist',
    options: [
      { label: '完全没有', value: 0 },
      { label: '有几天', value: 1 },
      { label: '一半以上的天数', value: 2 },
      { label: '几乎每天', value: 3 }
    ],
    questions: [
      { id: 1, text: '做事时提不起劲或没有兴趣' },
      { id: 2, text: '感到心情低落、沮丧或绝望' },
      { id: 3, text: '入睡困难、睡不安稳或睡眠过多' },
      { id: 4, text: '感觉疲倦或没有活力' },
      { id: 5, text: '食欲不振或吃得太多' },
      { id: 6, text: '觉得自己很糟，或觉得自己很失败，或让自己、家人失望' },
      { id: 7, text: '对事物专注有困难，例如阅读或看电视时' },
      { id: 8, text: '动作或说话速度缓慢到别人已经察觉，或正好相反——烦躁、坐立不安、动来动去' },
      { id: 9, text: '有不如死掉或用某种方式伤害自己的念头' }
    ],
    bands: [
      {
        min: 0,
        max: 4,
        level: 'minimal',
        title: '状态尚平稳',
        summary: '过去两周里，抑郁相关的困扰在你身上出现得很少。',
        suggestion:
          '继续保持现在的生活节奏就好。如果愿意，可以去「呼吸与冥想」做一次简短的放松练习，把这份平稳存进身体里。'
      },
      {
        min: 5,
        max: 9,
        level: 'mild',
        title: '轻度困扰',
        summary: '一些低落、疲惫或兴趣减退的信号，正在你身上出现。',
        suggestion:
          '这是身体在轻声提醒你：该关照自己了。试试每天 10 分钟的正念呼吸，或在心愿墙写下一件压在心里的小事——被看见，本身就是疗愈的开始。'
      },
      {
        min: 10,
        max: 14,
        level: 'moderate',
        title: '中度困扰',
        summary: '这些困扰可能已经开始影响你的睡眠、精力或日常状态。',
        suggestion:
          '你的感受是真实的，也值得被认真对待。除了使用平台的自助工具，我们诚恳地建议你考虑预约学校心理中心或正规心理咨询机构，和专业人士谈一谈。'
      },
      {
        min: 15,
        max: 27,
        level: 'severe',
        title: '需要被认真接住',
        summary: '你正在承受的重量，已经超过了一个人该独自扛住的程度。',
        suggestion:
          '请相信：这不是你的错，也不是软弱。我们强烈建议你尽快联系专业心理援助——北京心理危机研究与干预中心热线 010-82951332，全国 24 小时心理援助热线 400-161-9995。你不必独自走过这段路。'
      }
    ]
  },
  {
    id: 'gad7',
    name: '焦虑症状自评量表',
    shortName: 'GAD-7',
    category: '情绪',
    description: '过去两周里，你有多经常被以下问题困扰？焦虑是人类最古老的警报系统，先看看它最近响得有多频繁。',
    evidence:
      'Spitzer 等 (2006) 发表于 Archives of Internal Medicine，α = 0.92，对广泛性焦虑有良好筛查效度。',
    duration: '约 2 分钟',
    maxScore: 21,
    theme: 'amber',
    options: [
      { label: '完全没有', value: 0 },
      { label: '有几天', value: 1 },
      { label: '一半以上的天数', value: 2 },
      { label: '几乎每天', value: 3 }
    ],
    questions: [
      { id: 1, text: '感到紧张、焦虑或心急' },
      { id: 2, text: '无法停止或控制担忧' },
      { id: 3, text: '对各种各样的事情担忧过多' },
      { id: 4, text: '很难放松下来' },
      { id: 5, text: '坐立不安，很难安静地坐着' },
      { id: 6, text: '变得容易烦恼或急躁' },
      { id: 7, text: '感到害怕，好像有什么可怕的事情要发生' }
    ],
    bands: [
      {
        min: 0,
        max: 4,
        level: 'minimal',
        title: '内心大体安宁',
        summary: '焦虑的警报最近很少响起，你的内在状态比较稳定。',
        suggestion: '把这份安宁当作基线收藏好。当未来波动来临时，你会记得自己原本的样子。'
      },
      {
        min: 5,
        max: 9,
        level: 'mild',
        title: '轻度焦虑',
        summary: '担忧和紧绷偶尔会来访，但还没有占据你的生活。',
        suggestion:
          '试试「呼吸与冥想」里的 4-7-8 呼吸法，它是经过验证的、能快速安抚神经系统的方法。写下担忧的内容，也能帮大脑「卸载」。'
      },
      {
        min: 10,
        max: 14,
        level: 'moderate',
        title: '中度焦虑',
        summary: '紧绷感可能已经影响了你的专注、睡眠或身体状态。',
        suggestion:
          '你的神经系统已经高负荷运转了一段时间。除了自助练习，建议认真考虑与心理咨询师谈一谈——认知行为疗法（CBT）对焦虑有充分实证支持。'
      },
      {
        min: 15,
        max: 21,
        level: 'severe',
        title: '需要专业支持',
        summary: '焦虑的强度已经明显超出日常波动，你不必独自硬撑。',
        suggestion:
          '请优先照顾自己的安全与稳定。建议尽快联系专业心理机构或医院心理科；若感到难以承受，可拨打全国心理援助热线 400-161-9995。求助是勇敢，不是软弱。'
      }
    ]
  },
  {
    id: 'pss10',
    name: '压力感知量表',
    shortName: 'PSS-10',
    category: '压力',
    description: '过去一个月里，你对生活的感受如何？它测量的不是压力事件本身，而是你内心的失控感与负荷感。',
    evidence:
      'Cohen 等 (1983) 编制，全球使用最广的压力感知测量工具，中文版 α ≈ 0.85。',
    duration: '约 3 分钟',
    maxScore: 40,
    theme: 'moss',
    options: [
      { label: '从不', value: 0 },
      { label: '几乎不', value: 1 },
      { label: '有时', value: 2 },
      { label: '经常', value: 3 },
      { label: '总是', value: 4 }
    ],
    questions: [
      { id: 1, text: '因为一些意想不到的事情发生而感到心烦意乱' },
      { id: 2, text: '感到无法控制自己生活中重要的事情' },
      { id: 3, text: '感到紧张不安或有压力' },
      { id: 4, text: '对自己处理个人问题的能力感到有信心（反向计分）' },
      { id: 5, text: '感到事情正朝着你期望的方向发展（反向计分）' },
      { id: 6, text: '发现自己无法应付所有必须做的事情' },
      { id: 7, text: '能够控制生活中令人恼火的事情（反向计分）' },
      { id: 8, text: '感到自己能掌控全局（反向计分）' },
      { id: 9, text: '因为一些无法控制的事情而感到生气' },
      { id: 10, text: '感到困难堆积如山，自己无法克服' }
    ],
    bands: [
      {
        min: 0,
        max: 13,
        level: 'minimal',
        title: '压力在可承受范围',
        summary: '你对生活的掌控感良好，压力没有明显越界。',
        suggestion: '保持现在的节奏与边界感。偶尔留一段空白时间给自己，是最好的预防。'
      },
      {
        min: 14,
        max: 26,
        level: 'mild',
        title: '中度压力感',
        summary: '失控感偶尔会漫上来，你正在承重前行。',
        suggestion:
          '压力管理的关键不是消灭压力，而是恢复「我能做点什么」的掌控感。试着把一件大事拆成今天能做的最小一步，然后去完成它。'
      },
      {
        min: 27,
        max: 40,
        level: 'severe',
        title: '压力已经超载',
        summary: '负荷感与失控感持续偏高，你的身心都在发出警报。',
        suggestion:
          '请先允许自己减速——这不是逃避，是保养。认真考虑削减非必要的任务，并向信任的人或专业咨询师求助。长期超载的压力需要被分担，而不是被忍耐。'
      }
    ]
  },
  {
    id: 'ucla3',
    name: '孤独感简版量表',
    shortName: 'UCLA-3',
    category: '人际',
    description: '孤独不是身边有没有人，而是心与心之间有没有联结。三个问题，看看你最近的联结感如何。',
    evidence:
      'Hughes 等 (2004) 从 UCLA 孤独量表中提取的三题简版，与完整版相关 r = 0.82，适用于快速筛查。',
    duration: '约 1 分钟',
    maxScore: 9,
    theme: 'mist',
    options: [
      { label: '几乎没有', value: 1 },
      { label: '偶尔', value: 2 },
      { label: '经常', value: 3 }
    ],
    questions: [
      { id: 1, text: '你有多经常感到自己缺少陪伴？' },
      { id: 2, text: '你有多经常感到被冷落？' },
      { id: 3, text: '你有多经常感到与他人隔绝？' }
    ],
    bands: [
      {
        min: 3,
        max: 5,
        level: 'minimal',
        title: '联结感良好',
        summary: '你与世界之间，有温暖的线在牵着。',
        suggestion: '珍惜并维系这些联结。也可以去心愿墙做那个「递灯的人」，把温暖递给正在孤独里的人。'
      },
      {
        min: 6,
        max: 7,
        level: 'mild',
        title: '偶有孤独',
        summary: '某些时刻，你会感到与周围隔着一层薄薄的玻璃。',
        suggestion:
          '孤独感是人对联结的正常渴望，不必为此羞愧。可以从低压力的联结开始：在心愿墙留一段话，或和 AI 伙伴聊聊。被回应的感觉，会慢慢融化那层玻璃。'
      },
      {
        min: 8,
        max: 9,
        level: 'moderate',
        title: '孤独感偏高',
        summary: '隔绝感出现的频率偏高，你或许已经独自待了很久。',
        suggestion:
          '长期的孤独会像慢性病一样消耗人。请认真对待它：尝试每周安排一次低门槛的真实接触（散步时的一句问候也算），并考虑通过心理咨询梳理关系中的卡点。你值得被真正地看见。'
      }
    ]
  },
  {
    id: 'sleep',
    name: '睡眠状况自评',
    shortName: 'SLEEP-5',
    category: '睡眠',
    description: '睡眠是情绪的镜子。五个问题，看看你最近的睡眠质量。（基于 PSQI 与 ISI 核心维度简编）',
    evidence:
      '参考 PSQI（Buysse 等, 1989）与 ISI（Morin, 1993）核心维度编制的简版自评，用于自我觉察而非诊断。',
    duration: '约 1 分钟',
    maxScore: 15,
    theme: 'amber',
    options: [
      { label: '从不', value: 0 },
      { label: '每周少于 1 次', value: 1 },
      { label: '每周 1-2 次', value: 2 },
      { label: '每周 3 次以上', value: 3 }
    ],
    questions: [
      { id: 1, text: '躺下后超过 30 分钟才能入睡' },
      { id: 2, text: '半夜醒来后难以再次入睡' },
      { id: 3, text: '醒得太早，且无法继续睡' },
      { id: 4, text: '白天感到困倦、精力不足' },
      { id: 5, text: '睡前思绪纷乱，停不下来' }
    ],
    bands: [
      {
        min: 0,
        max: 3,
        level: 'minimal',
        title: '睡得还不错',
        summary: '你的睡眠节律大体稳定。',
        suggestion: '好好睡觉是性价比最高的心理保养。保持现在的睡前仪式就好。'
      },
      {
        min: 4,
        max: 8,
        level: 'mild',
        title: '睡眠有些波动',
        summary: '入睡或维持睡眠偶尔有些困难，白天可能略感疲惫。',
        suggestion:
          '睡前一小时试试「光线递减法」：调暗灯光、放下手机、做一组缓慢的呼吸。平台「呼吸与冥想」里的睡前引导，专为纷乱的思绪设计。'
      },
      {
        min: 9,
        max: 15,
        level: 'moderate',
        title: '睡眠需要被修复',
        summary: '睡眠问题出现的频率已经偏高，可能正在影响白天的你。',
        suggestion:
          '长期睡眠不足会放大焦虑与低落。请认真对待：固定起床时间比固定入睡时间更重要；白天多接触自然光；若持续超过一个月，建议咨询医生或睡眠门诊。'
      }
    ]
  }
]

export function getScale(id: string): Scale | undefined {
  return scales.find((s) => s.id === id)
}

// PSS-10 反向计分题（题号 4/5/7/8，值为 4 - 原值）
const PSS_REVERSED = new Set([4, 5, 7, 8])

export function calcScore(scaleId: string, answers: number[]): number {
  if (scaleId === 'pss10') {
    return answers.reduce((sum, v, i) => {
      const q = i + 1
      return sum + (PSS_REVERSED.has(q) ? 4 - v : v)
    }, 0)
  }
  return answers.reduce((sum, v) => sum + v, 0)
}
