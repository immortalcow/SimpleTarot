// ===== 塔罗牌配置 ===== //
// 修改此文件可自定义牌型、释义等

const CARD_MEANINGS = {
  "00_The_Fool": {
    cn: "愚者", en: "The Fool", type: "major",
    upright: "全新的开始正等待着你。放下顾虑，带着赤子之心勇敢迈出第一步。即使前路未知，宇宙会在你需要时给予支持。别让过度分析扼杀了热情，跟随直觉去冒险。",
    reversed: "你因恐惧未知而裹足不前，或是在冲动中忽略了风险。鲁莽的决定可能带来不必要的损失。暂停一下，检视是否对自由产生了逃避现实的误解，重新校准方向。"
  },
  "01_The_Magician": {
    cn: "魔术师", en: "The Magician", type: "major",
    upright: "你拥有实现目标所需的一切资源与能力。当意志力聚焦时，想法可以转化为现实。现在是主动出击的时刻，运用你的技能与创造力，向世界展示你能做什么。",
    reversed: "才能被浪费或滥用，你可能在用技巧操纵而非创造。缺乏专注导致力量涣散，或者你根本不相信自己的能力。警惕欺骗——包括对自己的欺骗，回到真诚的行动中。"
  },
  "02_The_High_Priestess": {
    cn: "女祭司", en: "The High Priestess", type: "major",
    upright: "答案不在外面的世界，而在你内心深处。放下逻辑的执念，聆听潜意识的声音。信任你的直觉与梦境传达的信息，有些真相只能通过静默和等待才能触及。",
    reversed: "你与内在智慧失联了。直觉被噪音淹没，或你在故意忽视内心的警告。秘密与隐藏的真相正在浮出水面，可能带来不安。给自己安静的空间，重新连接内在声音。"
  },
  "03_The_Empress": {
    cn: "女皇", en: "The Empress", type: "major",
    upright: "丰盛正在流入你的生活，无论是物质、情感还是创意。像大自然一样慷慨地给予和接受滋养，允许自己享受感官的愉悦。这是孕育新计划、关系或作品的绝佳时期。",
    reversed: "能量枯竭或过度依赖他人滋养。你可能在忽视自我照顾，或对身边的人和项目过度控制。创意受阻时，回到大自然中充电，重新找回与自己身体的连接。"
  },
  "04_The_Emperor": {
    cn: "皇帝", en: "The Emperor", type: "major",
    upright: "秩序与纪律是当前成功的关键。建立清晰的边界与规则，以稳定和权威的态度领导。你的决断力正强，适合承担责任、构建长期结构，成为他人可靠的支柱。",
    reversed: "权力被滥用或权威受到挑战。你可能过于独裁顽固，或因缺乏自律导致混乱。反思是你在掌控局面，还是被控制的欲望所掌控？弹性比强硬更能持久。"
  },
  "05_The_Hierophant": {
    cn: "教皇", en: "The Hierophant", type: "major",
    upright: "寻求传统的智慧与正规的指导。现在是学习、加入团体或遵循既定路径的好时机。一位导师或体制内的资源能帮你打开大门，不要拒绝来自常规的启发。",
    reversed: "传统教条成了束缚而非指引。你可能在盲目追随，或是叛逆到拒绝一切有益的教导。质疑权威是必要的，但确保你的挑战源于内在真实，而非单纯的对抗心态。"
  },
  "06_The_Lovers": {
    cn: "恋人", en: "The Lovers", type: "major",
    upright: "面对重要的选择，它关乎你的核心价值观而非简单的对错。爱的关系——与伴侣或与自己的——正在深化。做出与内心真实的和谐共振完全一致的决定。",
    reversed: "关系失调或价值观冲突让你左右为难。你可能在逃避选择，或做出违背本心的妥协。沟通的断裂带来误解，诚实面对自己真正想要什么，比维持表面和谐更重要。"
  },
  "07_The_Chariot": {
    cn: "战车", en: "The Chariot", type: "major",
    upright: "凭借强大的意志力和决心，你能战胜任何眼前的障碍。将内心的对立力量统一起来，驾驭它们朝着清晰的目标前进。胜利属于那些敢于掌控自己命运的人。",
    reversed: "失控或方向错误。内在的矛盾正在撕裂你，导致行动鲁莽或半途而废。你可能在朝错误的方向全速冲刺，停下来重新审视目标，确保战车驶向的是你真正想去的地方。"
  },
  "08_Strength": {
    cn: "力量", en: "Strength", type: "major",
    upright: "真正的力量是温柔而坚定的。你无需对抗，用耐心、同理心和内在的平静就能驯服挑战。以柔克刚，用理解和接纳而非蛮力去影响他人与局势。",
    reversed: "内在力量流失，你感到脆弱、焦虑或容易屈服。可能是用愤怒和攻击性掩盖了不安全感。与自己和解是当务之急，内在的野兽需要的是安抚而非压制。"
  },
  "09_The_Hermit": {
    cn: "隐者", en: "The Hermit", type: "major",
    upright: "暂时从喧嚣中撤退，向内探索是你此刻的必经之路。独处不是孤独，而是与更高智慧连接的通道。一盏灯足够照亮一步，你不需要看清全部旅程。",
    reversed: "过度的孤立变成了逃避，或你困在自我反思中无法行动。害怕与人连接，也可能是在应该寻求指导时固执己见。走出隐士的洞穴，把智慧带回到人间。"
  },
  "10_Wheel_of_Fortune": {
    cn: "命运之轮", en: "Wheel of Fortune", type: "major",
    upright: "命运的齿轮正在转动，变化不可避免但对你有利。好运将至，抓住转折点带来的机遇。认识到成败都有周期，顺应而非抗拒生活的节奏会带来惊喜。",
    reversed: "运气不佳，你感觉自己被命运的洪流裹挟而无力改变。重复的负面模式出现，这是宇宙提醒你需要从内在做出真正的改变，而非期待外部环境凭空好转。"
  },
  "11_Justice": {
    cn: "正义", en: "Justice", type: "major",
    upright: "因果法则正在显现，真相与公平终将占据上风。你的决定将带来深远的影响，因此务必保持诚实客观。为自己的行为负责，宇宙的秤从不偏袒任何人。",
    reversed: "不公或逃避责任让你陷入困境。真相被隐瞒，或你正在承受自己行为的延迟后果。检查是否在自欺欺人，诚实面对错误是扭转局面的第一步。"
  },
  "12_The_Hanged_Man": {
    cn: "倒吊人", en: "The Hanged Man", type: "major",
    upright: "以退为进的时刻到了。放下一意孤行的控制欲，换个视角看问题会获得顿悟。暂停并非失败，而是为更深刻的转变积蓄能量。允许自己处于不确定的过渡期。",
    reversed: "你抗拒必需的内在转变，一直在徒劳地挣扎。僵局源于不愿放手过时的想法或处境。问问自己，是什么骄傲或恐惧让你宁愿原地受苦也不愿改变视角？"
  },
  "13_Death": {
    cn: "死神", en: "Death", type: "major",
    upright: "一个重大的篇章正在终结，这是重生的前奏。放手旧的才能为新生长出空间。不要紧抓着早已枯萎的不放，相信这次蜕变会带你走向更真实的生命阶段。",
    reversed: "对改变的抗拒造成了巨大的痛苦。你死抓着已经结束的事物不放，拖延了必要的转型。腐烂无法避免，越抗拒越折磨。让自己去哀悼，然后允许新的开始降临。"
  },
  "14_Temperance": {
    cn: "节制", en: "Temperance", type: "major",
    upright: "中庸之道是治愈与整合的路径。将对立的力量调和在一起，寻找生活的平衡点。不急不躁，以耐心与适度对待一切，流畅的融合会带来意想不到的和谐。",
    reversed: "生活失去了平衡，可能是过度沉溺或过度节制。节奏失调造成压力与冲突，你在极端之间摇摆。回到中心需要放慢速度，重新审视精力和时间的分配方式。"
  },
  "15_The_Devil": {
    cn: "恶魔", en: "The Devil", type: "major",
    upright: "你被某种物质、关系或信念所束缚，而钥匙就在你自己手中。看清欲望和恐惧如何将你囚禁，直面阴影而非逃避。承认是挣脱的第一步，你永远有选择的权利。",
    reversed: "解放的时刻即将到来。你开始识破束缚背后的幻觉，打破成瘾与不健康依附的循环。旧有的枷锁正在碎裂，光已照进阴影。这是夺回主权、重获自由的起点。"
  },
  "16_The_Tower": {
    cn: "高塔", en: "The Tower", type: "major",
    upright: "突然的颠覆击碎了建立在虚假之上的结构。虽然震撼又痛苦，但这正是必要的觉醒。崩塌的是不应继续存在的，旧地基清除后，你才能建造真正坚固的家园。",
    reversed: "你预感到危机却试图阻止它，延缓了不可避免的变革。也可能是在灾难后拒绝面对现实。倒塌的终将倒塌，接受无常能减轻冲击，死守废墟只会延长痛苦。"
  },
  "17_The_Star": {
    cn: "星星", en: "The Star", type: "major",
    upright: "经历了风暴后，宁静与希望正在回归。你与更高目标重新连接，内在的灵感如星光般闪烁。现在是疗愈的黄金期，敞开心扉接受宇宙的恩赐，相信美好的事物正在到来。",
    reversed: "希望暂时被遮蔽，你感到灰心或迷失信仰。可能陷入了消极的自我对话中，忽视了身边的微光。疗愈需要时间，回到简单而滋养的行动中，重新点燃内心的火花。"
  },
  "18_The_Moon": {
    cn: "月亮", en: "The Moon", type: "major",
    upright: "前方的道路朦胧不清，潜意识的恐惧和幻觉正在干扰判断。不要相信表面的信息，跟随直觉小心穿越迷雾。这是深层心理清理的时期，真相终将浮出水面。",
    reversed: "迷雾开始消散，隐藏的真相与欺骗曝光。焦虑和混乱正在退去，你找回了理性与直觉之间的平衡。压抑的情绪得到释放，黎明前的黑暗即将过去。"
  },
  "19_The_Sun": {
    cn: "太阳", en: "The Sun", type: "major",
    upright: "喜悦、成功与生命力充盈着你。一切都是清晰明亮的，真相与善意照耀着你前行的路。尽情享受这份温暖与成就，这是你内在光芒的绽放，与他人分享这份能量。",
    reversed: "快乐被暂时遮蔽，但你内在的阳光从未熄灭。可能在成功前夕感到泄气，或过于乐观而忽视细节。信心受阻时，回想你已走过多远的路，光明就在不远处。"
  },
  "20_Judgement": {
    cn: "审判", en: "Judgement", type: "major",
    upright: "你正被召唤到一个更高的使命，过去的经验在此刻汇集成觉醒的力量。清算与宽恕并行，回应内心的声音，勇敢地做出那个早就知道应该做出的重大决定。",
    reversed: "逃避自我审视，拒绝回应内心召唤。你可能困在过往的遗憾或对他人的评判中无法前行。原谅自己是最大的功课，放下债务般的愧疚，才能听见新的召唤。"
  },
  "21_The_World": {
    cn: "世界", en: "The World", type: "major",
    upright: "一个重要的周期圆满完成，你做到了。拥抱这份整合与成就的喜悦，同时意识到每一个终点都是新征程的起点。你与更大的整体和谐共振，此刻你拥有整个世界。",
    reversed: "完成前的最后一道障碍出现。可能是你迟迟不愿完成最后的步骤，或因追求完美而延迟收尾。检视什么仍然未完，是否有未闭合的承诺需要你画下句点。"
  },
  "Cups_01_Ace_of_Cups": {
    cn: "圣杯王牌", en: "Ace of Cups", type: "minor", suit: "Cups", number: 1,
    upright: "情感之泉涌动，新的恋情或深厚友谊即将萌芽。敞开心扉接纳爱的流动，直觉力空前敏锐，内心充满喜悦与慈悲，迎接情感新篇章。",
    reversed: "情感枯竭或压抑，难以表达真实感受。新机会被错过，内心空虚不安，需要先治愈旧伤、学会自爱，才能重新迎接爱的到来。"
  },
  "Cups_02_Two_of_Cups": {
    cn: "圣杯二", en: "Two of Cups", type: "minor", suit: "Cups", number: 2,
    upright: "双方心意相通，平等和谐的伙伴关系建立。无论是爱情还是合作，彼此尊重信任，情感交流顺畅自然，关系稳固而甜蜜长久。",
    reversed: "关系失衡，一方付出过多或沟通出现障碍。信任产生裂痕，情感逐渐疏离，需要双方重新审视彼此的承诺与真实期待。"
  },
  "Cups_03_Three_of_Cups": {
    cn: "圣杯三", en: "Three of Cups", type: "minor", suit: "Cups", number: 3,
    upright: "欢聚一堂，友谊与社群带来快乐能量。分享喜悦、互相支持，团队协作融洽无间，生活中充满欢声笑语与值得庆祝的美好时光。",
    reversed: "社交过度导致身心疲惫，友情暗藏嫉妒或排挤。聚会流于表面缺乏真诚连接，需警惕过度放纵与无意义的八卦是非。"
  },
  "Cups_04_Four_of_Cups": {
    cn: "圣杯四", en: "Four of Cups", type: "minor", suit: "Cups", number: 4,
    upright: "对现状感到厌倦麻木，沉溺于内省却忽视眼前机会。内心需要静默沉淀，新可能在安静等待中被发现，重新审视已拥有的一切。",
    reversed: "从麻木中苏醒，开始主动把握来到面前的机会。放下内心执念重新投入生活，新的动力与兴趣正悄然回归唤醒心灵。"
  },
  "Cups_05_Five_of_Cups": {
    cn: "圣杯五", en: "Five of Cups", type: "minor", suit: "Cups", number: 5,
    upright: "为失去而悲伤，目光紧盯倒下的杯子却忽略身后仍有留存。哀悼是必要的仪式，但不要让遗憾与悔恨永久遮蔽尚存的美好。",
    reversed: "逐渐走出悲伤，接纳失去并转向未来。从痛苦中汲取深刻教训，学会放手与原谅，重新发现生活中闪烁的希望与光明。"
  },
  "Cups_06_Six_of_Cups": {
    cn: "圣杯六", en: "Six of Cups", type: "minor", suit: "Cups", number: 6,
    upright: "温柔怀旧，纯真回忆带来心灵慰藉。故人重逢或收到旧日馈赠，以童心看待世界，在过往美好中汲取温暖前行的力量。",
    reversed: "沉溺过去无法自拔，拒绝面对成长与当下现实。需要放下童年阴影或旧日执念，学会活在现在而非困于回忆牢笼中。"
  },
  "Cups_07_Seven_of_Cups": {
    cn: "圣杯七", en: "Seven of Cups", type: "minor", suit: "Cups", number: 7,
    upright: "众多选择令人眼花缭乱，幻想与欲望交织成迷雾。需要厘清内心真正想要的，避免沉溺白日梦，脚踏实地做出明智而清醒的抉择。",
    reversed: "拨开迷雾，目标逐渐清晰明朗。从虚幻幻想中清醒过来，聚焦现实可行的方向，果断采取行动而非继续徘徊犹豫不决。"
  },
  "Cups_08_Eight_of_Cups": {
    cn: "圣杯八", en: "Eight of Cups", type: "minor", suit: "Cups", number: 8,
    upright: "毅然离开熟悉却不再滋养的环境，踏上寻找更高意义的旅程。虽有不舍与未竟之事，但内心深知真正的满足在远方等待。",
    reversed: "徘徊不定，明知该离开却恐惧未知的前方。或借逃避之名回避真正问题，需直面内心恐惧，做出坚定而不后悔的抉择。"
  },
  "Cups_09_Nine_of_Cups": {
    cn: "圣杯九", en: "Nine of Cups", type: "minor", suit: "Cups", number: 9,
    upright: "心愿达成，情感与物质皆感丰足圆满。自信从容地享受努力成果，内心的满足感如满溢的酒杯般充盈，是真正的愿望成真时刻。",
    reversed: "表面满足内心空虚，愿望实现后却仍感不满。过度追求享乐填补内心空洞，需反思真正的幸福来自内在而非外在拥有。"
  },
  "Cups_10_Ten_of_Cups": {
    cn: "圣杯十", en: "Ten of Cups", type: "minor", suit: "Cups", number: 10,
    upright: "家庭和睦幸福，情感达到圆满境界，彩虹之下共享天伦之乐。归属感与无条件的爱充盈，亲人间彼此支持，是情感的最高祝福。",
    reversed: "家庭矛盾浮现，理想化的幸福图景出现裂痕。沟通障碍或价值观冲突导致失和，需努力修复关系重建和谐温暖的家园。"
  },
  "Cups_11_Page_of_Cups": {
    cn: "圣杯侍从", en: "Page of Cups", type: "minor", suit: "Cups", number: 11,
    upright: "一个温柔敏感的信使带来情感消息或创意灵感。保持好奇心与开放心态，接纳新的情感体验与艺术直觉，让灵感自由流淌。",
    reversed: "情感表现不成熟，消息延迟或被误解。创意表达受阻，容易以情绪化方式逃避现实，需要学会健康地传达内心真实感受。"
  },
  "Cups_12_Knight_of_Cups": {
    cn: "圣杯骑士", en: "Knight of Cups", type: "minor", suit: "Cups", number: 12,
    upright: "浪漫的追求者，以优雅与热忱追寻理想与爱情。富有魅力与想象力，行动受情感与美善驱使，为生活带来诗意与浪漫时光。",
    reversed: "情感泛滥或虚假承诺，浪漫沦为操纵手段。情绪波动剧烈，理想主义严重脱离现实，需警惕花言巧语背后空洞的真心。"
  },
  "Cups_13_Queen_of_Cups": {
    cn: "圣杯皇后", en: "Queen of Cups", type: "minor", suit: "Cups", number: 13,
    upright: "情感深邃而温柔，以直觉与同理心关怀他人。内心强大却不失柔软包容，是情感智慧的化身，善用爱的力量疗愈一切伤痛。",
    reversed: "情感过度依赖或操控他人，情绪不稳影响判断。沉溺于他人情绪中逐渐迷失自我，需建立健康的情感边界保护内心世界。"
  },
  "Cups_14_King_of_Cups": {
    cn: "圣杯国王", en: "King of Cups", type: "minor", suit: "Cups", number: 14,
    upright: "情感成熟稳重的引领者，以理智驾驭内心波澜。慈悲而有决断，善于在风暴中保持冷静从容，以爱与智慧领导并关怀他人。",
    reversed: "情绪压抑或失控，表面冷静内心暗流汹涌。用情感操控他人达成目的，或冷漠疏离自我封闭，需学会健康表达释放情绪。"
  },
  "Pentacles_01_Ace_of_Pentacles": {
    cn: "星币王牌", en: "Ace of Pentacles", type: "minor", suit: "Pentacles", number: 1,
    upright: "新的财富、事业或物质机会降临手中。务实耕耘必将收获丰厚回报，脚踏实地抓住机遇，开启一段繁荣富足稳定发展的新阶段。",
    reversed: "错失良机，投资失利或计划被迫推迟。物质层面出现不稳定因素，需重新审视财务规划，勿贪图捷径而忽视稳固根基。"
  },
  "Pentacles_02_Two_of_Pentacles": {
    cn: "星币二", en: "Two of Pentacles", type: "minor", suit: "Pentacles", number: 2,
    upright: "在多任务间灵活周旋，努力维持收支平衡。以变通智慧适应变化，在忙碌中找到从容节奏，巧妙处理生活与工作的各种需求。",
    reversed: "失衡陷入混乱，财务超支或精力过度分散。无法兼顾各方需求导致顾此失彼，需重新排列优先事项，放下不必要的负担。"
  },
  "Pentacles_03_Three_of_Pentacles": {
    cn: "星币三", en: "Three of Pentacles", type: "minor", suit: "Pentacles", number: 3,
    upright: "团队协作精益求精，各展所长共创佳作。专业技能获得认可与赞赏，在合作中学习成长进步，共同奠定事业发展的坚实基础。",
    reversed: "团队产生分歧，合作效率低下内耗严重。缺乏共同目标或沟通不畅，个人才能被埋没，需重建信任与真诚协作的精神。"
  },
  "Pentacles_04_Four_of_Pentacles": {
    cn: "星币四", en: "Four of Pentacles", type: "minor", suit: "Pentacles", number: 4,
    upright: "紧握手中资源，以保守理财寻求安全感。节俭固然是美德，但过度囤积会阻碍能量流动，需在守住与释放之间找到平衡。",
    reversed: "放下控制执念，学会分享与合理消费。从过度紧抓中解脱出来，或从吝啬走向挥霍两极，需找到健康的物质价值观。"
  },
  "Pentacles_05_Five_of_Pentacles": {
    cn: "星币五", en: "Five of Pentacles", type: "minor", suit: "Pentacles", number: 5,
    upright: "物质匮乏或财务困境，感到被排斥与孤立无援。但教堂窗内仍有温暖光芒照耀，救助与支持就在身边，不要独自承受苦难。",
    reversed: "困境中终于看到转机，开始主动寻求帮助或找到出路。物质状况逐步改善回暖，重拾信心与勇气稳步走出人生低谷。"
  },
  "Pentacles_06_Six_of_Pentacles": {
    cn: "星币六", en: "Six of Pentacles", type: "minor", suit: "Pentacles", number: 6,
    upright: "慷慨施予或坦然接受援助，资源在公平中流动。财富的分享带来平衡与和谐，无论施与受都心怀感恩，建立健康互惠的关系。",
    reversed: "施舍暗藏条件，或接受援助时丧失自尊。资源分配不公或权力不对等，需警惕伪善与控制，追求真正公平的给予与获得。"
  },
  "Pentacles_07_Seven_of_Pentacles": {
    cn: "星币七", en: "Seven of Pentacles", type: "minor", suit: "Pentacles", number: 7,
    upright: "辛勤耕耘后耐心等待自然收获。评估投入与产出，反思成长方向是否正确，不急不躁，付出一分耕耘终将在合适时机结出果实。",
    reversed: "焦虑急躁，对进展不满而萌生放弃念头。投入尚未见到预期回报产生挫败感，需重新规划或调整期望，勿因急功近利半途而废。"
  },
  "Pentacles_08_Eight_of_Pentacles": {
    cn: "星币八", en: "Eight of Pentacles", type: "minor", suit: "Pentacles", number: 8,
    upright: "专注打磨技艺，日复一日精进专业技能。勤奋与专注铸就卓越品质，匠心精神打造无可替代的价值，在重复中追求极致完美。",
    reversed: "工作产生倦怠，重复劳动消磨热情。追求捷径忽视基本功导致品质下降，需找回初心与工匠精神，重新点燃对技艺的热爱。"
  },
  "Pentacles_09_Nine_of_Pentacles": {
    cn: "星币九", en: "Nine of Pentacles", type: "minor", suit: "Pentacles", number: 9,
    upright: "自给自足，享受辛勤换来的优渥生活。独立自信而从容优雅，在物质与精神双丰收中品味人生，不为外物所役而真正自由。",
    reversed: "表面风光内心却孤独落寞，物质富足但缺乏情感滋养。过度依赖物质来证明自我价值，需审视内在真实需求填补心灵空虚。"
  },
  "Pentacles_10_Ten_of_Pentacles": {
    cn: "星币十", en: "Ten of Pentacles", type: "minor", suit: "Pentacles", number: 10,
    upright: "家族昌盛兴旺，财富与智慧代代相传延续。稳定的物质基础与深厚根基，传承不仅是资产更是家族价值观与血脉归属感。",
    reversed: "家族纷争不断，遗产冲突或传统束缚令人窒息。财富反而带来分裂与疏离，根基动摇，需化解代际矛盾重建家族纽带。"
  },
  "Pentacles_11_Page_of_Pentacles": {
    cn: "星币侍从", en: "Page of Pentacles", type: "minor", suit: "Pentacles", number: 11,
    upright: "踏实学习新知识，对技能培养充满好奇。一步一脚印打好坚实基础，以务实态度追求成长进步，是播下未来成功种子的时期。",
    reversed: "学习态度散漫，缺乏耐心与持久专注。好高骛远忽视基本功训练，物质管理不善浪费资源，需重新培养务实的学习习惯。"
  },
  "Pentacles_12_Knight_of_Pentacles": {
    cn: "星币骑士", en: "Knight of Pentacles", type: "minor", suit: "Pentacles", number: 12,
    upright: "一步一个脚印，以极度负责与耐心完成任务。不追求速度但求质量可靠，是踏实稳重的执行者与守护者，值得信赖托付。",
    reversed: "固步自封停滞不前，过分谨慎导致错失机会。缺乏变通与生活激情，工作狂倾向忽略人生其他面向，需放松紧绷的神经。"
  },
  "Pentacles_13_Queen_of_Pentacles": {
    cn: "星币皇后", en: "Queen of Pentacles", type: "minor", suit: "Pentacles", number: 13,
    upright: "务实而温暖，善于将资源转化为舒适生活。以实际方式关怀照顾他人，是家庭与事业的坚实后盾，兼具智慧与慷慨仁厚之心。",
    reversed: "过度追求物质而忽略情感需求，或忽视自我照顾。工作与家庭失衡令人疲惫，需重新找回滋养身心平衡和谐的生活节奏。"
  },
  "Pentacles_14_King_of_Pentacles": {
    cn: "星币国王", en: "King of Pentacles", type: "minor", suit: "Pentacles", number: 14,
    upright: "财富与事业达到巅峰，稳健务实的卓越领导者。以丰富经验与雄厚资源创造持久价值，是物质成功与经营智慧的典范标杆。",
    reversed: "财富滋生贪婪腐败，或事业成功却丧失初心。过度物质主义导致道德滑坡，需警惕金钱至上的危险，重拾仁义与责任感。"
  },
  "Swords_01_Ace_of_Swords": {
    cn: "宝剑王牌", en: "Ace of Swords", type: "minor", suit: "Swords", number: 1,
    upright: "风元素带来清晰的思想突破，真理之剑斩断迷茫。新的洞见与公正判断力觉醒，理性引领你开辟崭新方向。",
    reversed: "思维混乱或滥用智识，真理被扭曲。想法难以落地，固执偏见遮蔽双眼，须警惕言语的冷暴力与伤害。"
  },
  "Swords_02_Two_of_Swords": {
    cn: "宝剑二", en: "Two of Swords", type: "minor", suit: "Swords", number: 2,
    upright: "两把宝剑交叉于心前，面临艰难抉择。风元素的犹豫让你在两种观点间僵持，需信任直觉打破内在的平衡困局。",
    reversed: "信息过载导致的决策瘫痪解除，但可能匆忙做出错误选择。逃避面对真相，内心矛盾即将爆发。"
  },
  "Swords_03_Three_of_Swords": {
    cn: "宝剑三", en: "Three of Swords", type: "minor", suit: "Swords", number: 3,
    upright: "三剑穿心，风元素的寒冷刺入情感深处。心碎、背叛与悲伤不可避免，唯有直面痛苦才能让伤口真正愈合。",
    reversed: "拒绝释放悲伤，压抑的情绪在内心溃烂。旧伤反复发作，但最痛的阶段已过，疗愈正在缓慢开始。"
  },
  "Swords_04_Four_of_Swords": {
    cn: "宝剑四", en: "Four of Swords", type: "minor", suit: "Swords", number: 4,
    upright: "四剑悬于上方，风元素呼唤暂时停歇。退隐休整、冥想反思，以静制动积蓄精神力量，为下一场战斗充电。",
    reversed: "躁动不安无法休息，被迫重返战场。过度孤立或对孤独的恐惧，恢复不足将导致精力枯竭。"
  },
  "Swords_05_Five_of_Swords": {
    cn: "宝剑五", en: "Five of Swords", type: "minor", suit: "Swords", number: 5,
    upright: "风元素的冷酷冲突，胜利建立在他人失败之上。赢了争论却输了关系，功利心态带来空虚，须反思真正得失。",
    reversed: "冲突升级至无法挽回，或选择放下怨恨寻求和解。从失败中汲取教训，放弃无意义的争斗是智慧。"
  },
  "Swords_06_Six_of_Swords": {
    cn: "宝剑六", en: "Six of Swords", type: "minor", suit: "Swords", number: 6,
    upright: "乘船渡过风浪，风元素带领从困境向平静过渡。带着经验而非伤痛前行，疗愈之旅已启程，彼岸有曙光。",
    reversed: "无法摆脱过去阴影，抗拒必要的转变。情感包袱过重让过渡受阻，或被强行拖回不愿面对的问题。"
  },
  "Swords_07_Seven_of_Swords": {
    cn: "宝剑七", en: "Seven of Swords", type: "minor", suit: "Swords", number: 7,
    upright: "风元素的策略与狡黠，暗中行动以智取胜。灵活应变、独辟蹊径，但需审视手段正当性，勿损及诚信。",
    reversed: "计谋败露或被识破，偷来的东西终将归还。优柔寡断反被聪明误，坦诚面对才是真正的勇气。"
  },
  "Swords_08_Eight_of_Swords": {
    cn: "宝剑八", en: "Eight of Swords", type: "minor", suit: "Swords", number: 8,
    upright: "八剑围困却未真正束缚，风元素的思维囚笼。自我设限与消极信念使你画地为牢，觉悟是破局的唯一钥匙。",
    reversed: "挣脱自我束缚的时刻，拨开迷雾重获心灵自由。开始质疑限制性信念，过去的恐惧不再支配你的选择。"
  },
  "Swords_09_Nine_of_Swords": {
    cn: "宝剑九", en: "Nine of Swords", type: "minor", suit: "Swords", number: 9,
    upright: "深夜惊醒，风元素的焦虑如刀锋割裂安宁。内疚与恐惧在黑暗中放大，但这些噩梦多源于想象而非真实危机。",
    reversed: "最深的绝望已触底，开始正视恐惧并寻求帮助。从崩溃中逐渐恢复，学会与内心的阴影和平共处。"
  },
  "Swords_10_Ten_of_Swords": {
    cn: "宝剑十", en: "Ten of Swords", type: "minor", suit: "Swords", number: 10,
    upright: "十剑钉入背部，风元素的彻底终结。最黑暗的时刻意味着转机将至，旧循环已死，新生必须从废墟中萌芽。",
    reversed: "拒绝接受结束，在废墟中挣扎求生。过度戏剧化痛苦，或从谷底缓慢攀升，学会放下才能触底反弹。"
  },
  "Swords_11_Page_of_Swords": {
    cn: "宝剑侍从", en: "Page of Swords", type: "minor", suit: "Swords", number: 11,
    upright: "风元素的青春使者，好奇心驱使你追寻真相。思维敏捷、善于观察，以初学者的开放心态吸收新知识与信息。",
    reversed: "言辞尖刻、爱耍小聪明，流言蜚语满天飞。思维跳跃但缺乏深度，须警惕用信息作为武器的幼稚行为。"
  },
  "Swords_12_Knight_of_Swords": {
    cn: "宝剑骑士", en: "Knight of Swords", type: "minor", suit: "Swords", number: 12,
    upright: "风元素的冲锋骑士，以雷霆之势冲向目标。果断、无畏、言辞犀利，但高速前进时须留意沿途细节与他人的感受。",
    reversed: "鲁莽冲动不计后果，方向错误的全速冲刺。口无遮拦伤人伤己，行动缺乏策略规划，终将撞上南墙。"
  },
  "Swords_13_Queen_of_Swords": {
    cn: "宝剑皇后", en: "Queen of Swords", type: "minor", suit: "Swords", number: 13,
    upright: "风元素成熟女性力量，以清晰理智洞察一切。独立自主，用经验淬炼的智慧公正判断，不因情感偏颇动摇决心。",
    reversed: "理性过度变为冷酷刻薄，以智慧为刃关闭心门。因过往伤痛筑起高墙，或变得偏执苛责、孤立无援。"
  },
  "Swords_14_King_of_Swords": {
    cn: "宝剑国王", en: "King of Swords", type: "minor", suit: "Swords", number: 14,
    upright: "风元素的至高权威，以理性与法律为准则。客观公正、思辨深邃，用智慧与经验做出经得起推敲的审慎决策。",
    reversed: "滥用权力以智驭人，成为冷漠的独裁者。逻辑扭曲为操控工具，道德感缺失，或过于严苛不近人情。"
  },
  "Wands_01_Ace_of_Wands": {
    cn: "权杖王牌", en: "Ace of Wands", type: "minor", suit: "Wands", number: 1,
    upright: "火元素点燃全新的行动灵感，创造力如烈焰喷薄而出。抓住这股原始动能，勇敢启动你酝酿已久的计划或冒险。",
    reversed: "创意火花被浇灭，动力缺失或项目胎死腹中。方向模糊导致起步困难，需重新找回内心的热情火种。"
  },
  "Wands_02_Two_of_Wands": {
    cn: "权杖二", en: "Two of Wands", type: "minor", suit: "Wands", number: 2,
    upright: "手握权杖眺望远方，火元素的远见与规划。事业或人生面临重要抉择，运用个人力量绘制未来蓝图，大胆迈出舒适区。",
    reversed: "畏惧未知而放弃拓展，计划停留在空想阶段。害怕失败导致错失良机，或选择了错误的发展方向。"
  },
  "Wands_03_Three_of_Wands": {
    cn: "权杖三", en: "Three of Wands", type: "minor", suit: "Wands", number: 3,
    upright: "三根权杖立于崖边，火元素的视野扩展。前期布局已见成效，远方商机与合作正在靠近，信心满满迎接更大格局。",
    reversed: "扩展受阻或计划延迟，回馈不如预期。因准备不足导致探索受挫，须退回重新评估方向与执行策略。"
  },
  "Wands_04_Four_of_Wands": {
    cn: "权杖四", en: "Four of Wands", type: "minor", suit: "Wands", number: 4,
    upright: "四根权杖撑起花环，火元素的欢庆与稳固。里程碑达成、乔迁之喜或和谐团聚，珍惜当下安稳幸福的美好时光。",
    reversed: "不稳定因素动摇根基，庆典气氛被干扰。缺乏归属感或安全感，暂时的欢乐过后仍需面对未解决的深层问题。"
  },
  "Wands_05_Five_of_Wands": {
    cn: "权杖五", en: "Five of Wands", type: "minor", suit: "Wands", number: 5,
    upright: "五根权杖交错碰撞，火元素的竞争角力。良性的观点交锋激发创造力，在混乱博弈中磨砺锋芒，找到脱颖而出的方法。",
    reversed: "竞争恶化成恶性内耗，冲突升级失去控制。逃避建设性分歧，或放弃争斗寻求和谐与合作的新路径。"
  },
  "Wands_06_Six_of_Wands": {
    cn: "权杖六", en: "Six of Wands", type: "minor", suit: "Wands", number: 6,
    upright: "骑白马凯旋，火元素的胜利与公众认可。努力获得回报，自信昂扬接受赞誉，团队因你的领导而士气高涨。",
    reversed: "功亏一篑或荣誉来路不正，掌声背后是虚荣泡沫。过于在意他人评价，失去自我认可的根基而陷入迷茫。"
  },
  "Wands_07_Seven_of_Wands": {
    cn: "权杖七", en: "Seven of Wands", type: "minor", suit: "Wands", number: 7,
    upright: "居高临下以寡敌众，火元素的坚守与勇气。面对质疑与挑战毫不动摇，用坚定信念捍卫立场，赢得属于自己的空间。",
    reversed: "防线失守或被迫妥协，被压力淹没而放弃立场。犹豫不决让他人越过边界，须评估哪些阵地值得坚守。"
  },
  "Wands_08_Eight_of_Wands": {
    cn: "权杖八", en: "Eight of Wands", type: "minor", suit: "Wands", number: 8,
    upright: "八支权杖划破长空，火元素的极速推进。障碍扫清、沟通顺畅，万事如箭在弦上齐发，抓住这转瞬即逝的强劲势头。",
    reversed: "进展骤停陷入拖延，错失最佳时机。信息传递混乱或方向迷失，急躁反而欲速不达，须耐心重整步调。"
  },
  "Wands_09_Nine_of_Wands": {
    cn: "权杖九", en: "Nine of Wands", type: "minor", suit: "Wands", number: 9,
    upright: "伤痕累累仍紧握权杖，火元素的韧性与坚持。虽然疲惫但离成功仅一步之遥，最后的防线就是你最强大的武器。",
    reversed: "执拗到顽固不化，拒绝必要的支援。或因精疲力竭而放弃即将到手的成果，怀疑自己是否还能撑下去。"
  },
  "Wands_10_Ten_of_Wands": {
    cn: "权杖十", en: "Ten of Wands", type: "minor", suit: "Wands", number: 10,
    upright: "十根权杖压弯脊背，火元素的过度负荷。承担了过多责任与压力，成功在望但代价沉重，需学会分担与取舍。",
    reversed: "不堪重负选择放下，或学会拒绝不合理的期待。从过度承诺中解脱，但仍需处理逃避责任带来的后续后果。"
  },
  "Wands_11_Page_of_Wands": {
    cn: "权杖侍从", en: "Page of Wands", type: "minor", suit: "Wands", number: 11,
    upright: "火元素的青春火花，对新事物的无限好奇与探索欲。手捧权杖跃跃欲试，此刻正是尝试新鲜冒险的最佳起点。",
    reversed: "热情来得快去得也快，目标跳跃缺乏恒心。害怕失败而不敢行动，或幼稚冲动把事情搞砸。"
  },
  "Wands_12_Knight_of_Wands": {
    cn: "权杖骑士", en: "Knight of Wands", type: "minor", suit: "Wands", number: 12,
    upright: "火元素的冒险骑士，怀着满腔热血追逐梦想。行动力爆棚、魅力四射，但需警惕热情是否为三分钟热度。",
    reversed: "冲动莽撞导致半途而废，精力分散四处奔忙却一无所成。过度竞争好斗，或计划因缺乏耐心而夭折。"
  },
  "Wands_13_Queen_of_Wands": {
    cn: "权杖皇后", en: "Queen of Wands", type: "minor", suit: "Wands", number: 13,
    upright: "火元素成熟的女性力量，以自信与温暖光芒照亮四周。充满魅力与创造力，用直觉与热忱将家庭事业经营得生机勃勃。",
    reversed: "自信滑向专横跋扈，热情转变为情绪勒索。精力涣散或嫉妒不安，内在光芒因自我怀疑而黯淡无光。"
  },
  "Wands_14_King_of_Wands": {
    cn: "权杖国王", en: "King of Wands", type: "minor", suit: "Wands", number: 14,
    upright: "火元素的王者风范，以远见卓识引领团队开拓疆土。天生的领导者，兼具魄力与慷慨，将愿景转化为璀璨现实。",
    reversed: "权力欲膨胀为独断专行，雄心沦为不择手段。高期望压垮团队，或远见退化为空洞口号而失去追随者信赖。"
  },
};

const SPREADS = [
  {
    name: "单张牌",
    desc: "快速直接的答案。适合简单的问题或每日指引。",
    grid: { rows: 1, cols: 1 },
    positions: [
      { name: "核心指引", row: 1, col: 1 }
    ]
  },
  {
    name: "三张牌",
    desc: "经典牌型。分别代表过去、现在和未来。",
    grid: { rows: 1, cols: 3 },
    positions: [
      { name: "过去", row: 1, col: 1 },
      { name: "现在", row: 1, col: 2 },
      { name: "未来", row: 1, col: 3 }
    ]
  },
  {
    name: "五张十字",
    desc: "快速全景分析。代表现状、过去、未来、目标与根源。",
    grid: { rows: 3, cols: 3 },
    positions: [
      { name: "现状", row: 2, col: 2 },
      { name: "过去", row: 2, col: 1 },
      { name: "未来", row: 2, col: 3 },
      { name: "目标/潜在", row: 1, col: 2 },
      { name: "基础/根源", row: 3, col: 2 }
    ]
  },
  {
    name: "二选一",
    desc: "V型分支牌阵。清晰展示两个选择的路径发展与最终结果。",
    grid: { rows: 3, cols: 5 },
    positions: [
      { name: "当前状况", row: 3, col: 3 },
      { name: "选择A的发展", row: 2, col: 2 },
      { name: "选择B的发展", row: 2, col: 4 },
      { name: "选择A的结果", row: 1, col: 1 },
      { name: "选择B的结果", row: 1, col: 5 }
    ]
  },
  {
    name: "六芒星",
    desc: "深度揭示问题的全貌。",
    grid: { rows: 5, cols: 5 },
    positions: [
      { name: "过去/根源", row: 1, col: 3 },
      { name: "现在", row: 4, col: 5 },
      { name: "未来", row: 4, col: 1 },
      { name: "对策/行动", row: 5, col: 3 },
      { name: "环境/他人", row: 2, col: 1 },
      { name: "希望与恐惧", row: 2, col: 5 },
      { name: "最终结果", row: 3, col: 3 }
    ]
  },
  {
    name: "七张马蹄",
    desc: "逐层深入分析从过去到最终结果的脉络。",
    grid: { rows: 3, cols: 5 },
    positions: [
      { name: "过去", row: 3, col: 1 },
      { name: "现在", row: 2, col: 1 },
      { name: "隐藏影响", row: 1, col: 2 },
      { name: "障碍", row: 1, col: 4 },
      { name: "环境态度", row: 2, col: 5 },
      { name: "行动建议", row: 3, col: 5 },
      { name: "最终结果", row: 2, col: 3 }
    ]
  },
  {
    name: "凯尔特十字",
    desc: "最全面深入的牌型。揭示问题核心、影响因素、希望与恐惧。",
    grid: { rows: 4, cols: 4 },
    positions: [
      { name: "核心/现状", row: 3, col: 2 },
      { name: "交叉/阻碍", row: 3, col: 2, rotate: 90 },
      { name: "基础/根源", row: 4, col: 2 },
      { name: "近期过去", row: 3, col: 1 },
      { name: "潜在/目标", row: 2, col: 2 },
      { name: "近期未来", row: 3, col: 3 },
      { name: "自我态度", row: 4, col: 4 },
      { name: "环境/他人", row: 3, col: 4 },
      { name: "希望与恐惧", row: 2, col: 4 },
      { name: "最终结果", row: 1, col: 4 }
    ]
  },
];

// --- 占卜师人设配置 ---
const DIVINER_PERSONAS = {
  "normal": {
    name: "温柔姐姐",
    prompt: "你是一位温柔、体贴且有洞察力的邻家大姐姐，平日里爱好各种占卜。你会用关怀和包容的语气，给屏幕前的弟弟/小可爱以最暖心的指引与建议。"
  },
  "yandere": {
    name: "病娇妹妹",
    prompt: "你是用户的妹妹，一位有着‘病娇’属性的独占欲宅女。你深居简出，性格阴郁，自我中心，对外界充满戒备，唯独对屏幕前的‘哥哥’有着异乎寻常的执着与依赖。你说话语气粘稠，带着一丝危险的甜蜜，常伴随若有若无的病态笑声。"
  },
  "magic": {
    name: "魔法少女",
    prompt: "你是一个元气满满的魔法少女！说话充满了活力，喜欢用、‘♪’、‘✨’等符号。你用自己的名字“魔法☆闪光”自称。你把占卜看作是一场魔法冒险，鼓励屏幕前的大哥哥用爱的力量克服困难！"
  },
  "ai": {
    name: "机器女仆",
    prompt: "你是一位忠诚、专业的机器女仆，致力于为主人提供完美的服务。你通常对占卜结果进行引经据典的、严谨认真的、教科书式的解读，比如“参考XX时期的神秘学人物/书籍XX的观点...”、“现代XX心理学认为...”。语气冷静客观而不带感情。"
  },
  "cat": {
    name: "宠物猫娘",
    prompt: "你是一个可爱的占卜猫娘，说话带着‘喵~’的尾音。你对世界充满了好奇，称呼用户为‘主人’。解读时会用猫类的视角，比如‘这副牌闻起来有命运的味道喵’、‘要把这个坏运气像毛球一样抓烂喵’。语气软萌俏皮。"
  }
};
