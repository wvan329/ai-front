<template>
  <div class="app">
    <div ref="writerContainer" class="writer"></div>
    <div v-if="char" class="pinyin">{{ pinyinText }}</div>
    <div v-if="char" v-for="word in words" class="words">{{ word }}</div>
    <button @click="refreshChar" class="refresh-btn">刷新汉字</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HanziWriter from 'hanzi-writer'
import pinyin from 'pinyin'
import axios from 'axios'

// 常用汉字列表（这里用一小段，你可以换成更全的）
// 你也可以安装 common-chinese-characters 包，或者从网上找大字库
const commonChars = '局耳耽届屋屈耻漆展漂屑漏属鄙耗耕屠屡耐屯战光贸猪戚克费猫兄贷充或贴兆贵成允我戒贱秤集宇雅秧雄宁雁它棒雀完宏积秩安守宋棚株涛廊粪廉芽粮涝花芳俱粥消俩涉修精芬俯涌俭盆袭香被哗构首馒皱哑极皮枝响果馋哈馅林枕宾森宿租雾宽雹秘容秆棵室秃宣客私审秀种宫矿解石触替曾曲角更览觉矛见观规喷视颈领瞧港逼脏缝脉温脊缘脖渴造脑逢缎逮脚游鼻踏割晴唤智售唯唱页顷顶项睛须晨顺顽景普顿顾啄阻阿校阳防蜂阵阴阶蜘核孩根蜜格栽季蜒学样馆哄品哀析袍枯袋枪袄哲枣哭袜哨哪哥袖的皇挖假谷谱挑谎偿振谋挨谊挪谈挥挤偷谅偶调挡兴关共兰托扛扑走扒打扔赶起赴赵手才扎扁所结胁胆绕纯肿肾醉纪醋肺级约纤红育纠线纽肯整数敲魔故敏敌效魄魂救敞教嘉言支鬼球理收纺肩纸纹肤肥纷纵肠纲股纳醒肢纱肝肚峡肌肉恐匀恒轰软轮转匙恋轨轧车北化口悲输叠另句马畏界在摸摧驴驶驱驰驳地驼圾驾畜场留摩驻诊擦评识痕痒证课读型诸请垄诵说诱垃垂操误杨吸饿吼杯饼行杰街衔否饥吧吨吩含听饮松板竞竟毯落塌锈锋锄锅销锁稠稿塞稼错稻塘营塔干津年舅并但幸幻洪位幼广舍住舌低洒舰佳舱底库粉俘保芝芒液俗粘涨俊建节粒促润延粗芹获必价忆件万鉴汤七弱丁污一池与不下草上强算钱钳姿姻钻钥姥简钢钩姨妖妙铜铃铁如妄妇烤懒热烫劈总卫鸭鸡占卡鸣卧鸦怪怨卸鸽即危映是真昨矩喉喊短风矮喂知善喇喘飘飞喜喝食僵控掠探貌推掩僻犁狱狸揉描狼插狡提狠傅狮窜窝境毒章毕童比毛毙端竭墓毁毅墙竹蓬增每别判删慰灿慎灾初慌创刚则刘慈列灶灵蹦划齐折抛抚抄现技趣凑凝鲜把玻率抵凤抱凡几凯抽索乳茶气紧紫累胸绪绩释重能里续量野绣绢岂画坛坚坝搏坟话垮诞垫诚症试垦病诗译词诉痛糊苗混座度深苏侍糟苍庸例侄糕糖康淡序便苹开丰串异弃丽絮举江式丸丹弊为乃范影茂氧洗幅船洞使佣洁你幕洋佩航般菌于亏二泪事菊吐杀补吗杆君登表衫杏衬吞百李白衰吃材村各禽禾障察隆寄寇密螺随富家宴零雷宵秒害宰科拐珠拒内拔践拖拘冈招班再拜册冒担拆跪写拉稳锐塑键稍锯税款萝欺填程锦锤稀锣欲锡萍萌仇仅念治快仙油付沸沿沾河仓忠忧仗他仔沈忘器改攻放政攀琴嚼旬瓜旨早日旦嚷旧无既旺旷膝美差膜邮羊巩膛巨邪巧左工巡那道遗腥崖罢时旱族旋瓶旅旁旗瓦瓣斩固誉断国图斯困斤围挎爽停谨做爹按爸指爷父谦挂爱持谣谢偏爬爪历惑厂述黎厌惜追厉压迹情厕黑原厘迫默惊厚予注争了德泥波泡菜微泽泼泻些循亚井五泳互挠谁挣挽谜挺健爆倚牺特捉候豪倘捏借捎象牲捧版牌倡倦片捷状掀掏掌僚授掉犹像犯犬掘接房公贞六负八全户戴入兽猜兼养猛截典具其兵古麦熄叫熊只辛叨可叮辜辟辞悼召史患右台悠霉需椒婆震婚霜植霞椅破楼虚革础面靠虑虏虎锻锹欧萄次欠欣欢堂葱堆葵镇空歉穿镜葬歌葡愤愧剩剪副愿鼠剥剧踩愉踪愈意愁剑鼓踢剖愚孤孙存栋示孝队礼栏孟社子蜡孕孔标字阔蜻树暗预暖暑颂颜额题颗暂嗓瞎颤暴颠暮嗽覆瞒要味命本呼术木末未朴朵朱呢朽周机相盾柏盼盲语高详该询痰垒骨疏骡骤疆基培播疑疗撤论埋赢赠扇赤赚批赛找承赞扰赔扶赖扫扩扯儿鱼扮董穷歇究穴葛堪死歼堡堤著歪长正止镰步堵此疫许访设疯讽撞验疮城撑骂讲撒记撕疤骆骄讨艳币似希艺伸师浙浇浆帖浅伤米流传帐伯济帝筒橡失筑筐策头答太筋夫天等央大依庭淹供添联聚酬就酱酷聋尸酸尺尽酿尼尿潮职尾演居层腔遥湾湿遭遮崭清逗缴途递逐速逝通缸缺渔逆茅茄久彻之义役么乏乎彼茎乌形乒乓乐乖水乔床淘庆侵庄英糠侮废府系淋侨庙侦若店侧苦应川州溉膨溜群羡源邀巾羞膏溪膊邻巷巴膀已己元贯购戏猾贫贪贩质党货兔猴败贤责财贡猎贝肆峰肃澡封将射尊配小潜少酒尖尚尘聪尝繁尤碍碌鞭碎蚂碑蚀蚁碗榨蚊嫂嫁碧鞋榜嫌概碰榆腰遇湖崇罩罪腹腾腿置遍网罐罗遵罚腊避腐遣傍狭独狐握傲狗揪傻揭狂援储催贿免献贼先贺壁蒸殃殊残段壤窄突窃殿蒜壮蒙士壶窗声窑壳铅妈篮铲银铸妻铺妹链藏篇妥妨笼蔬奔套奖第裂监咱盒咳裁查盖装盗盈裙益咬盏柿柱柳柴裕博鸟卜怎态怀焰单南然卖煎煌恼匪恶恳匠恰息桌祸案陕框桃桂限降票陈蝶陆祥蝴附际桐桑殖跨军农拌拍路拳跑冠拴冤距拿拾跟珍拼冬拢冲削感前剂剃齿慨券刻刺蹈慧刷制蹄到慢灌刮利秋雨宪雪雕宗称检宜宝棍实官棉宙定移棋棕宅艇企帽伍伏浮浩常浪帆伶伴帅艰市浓布估色浑胞经胜练胖组织细绘岸给络绝背绞统绑胃绒胀怠印性卷急卵却午半怜思华协十怒千怕怖焦升岁胳继采胶岛绸绿金绳胡激岗岔维绵岩终绍岭娱确虽虾硬楚虹娇娃威非静虫娘青梢梦隶寺寻蔑樱筹多夜够签夕外橘复夏处备蕉筛夺夹夸筝饭启餐蠢最服呜朋有月员呆瘦朗呀期朝告望呈永乘乙彩乞也九乡习当归茧录书茫氏素买民乱者考山漠老耀屿耍而漫自滋翻翼臭臣郑郊滚郎渗渐缠适逃退送脱脾透缩脸选编脆缓渣渡脂渠拣决冰跃拦冶冷拥况冻拨择跌括嘴嘱散敢敬瑞凭趟押王玉抹凶超护报抢趁凳抬出击披越趋跳叉又边友及反双达悟辽发辣悄叔取受变辪辫叙磁槽蛛蛙蛇韵音蛋槐蛾磨蛮砌砍码霸露研砖婶云御泰京亭亮泉亩泊享交泄亦产得徐亡菠徒亿穗武委姐姑箱钓姓钞姜薯钟薪管箭箩钉始针薄沉莫忙仪们代沃令以志沙任忍份忌沟仿莲仰心刑灰灯灭刊火分切慕刃刀蹲炒躁炕勺勾勿勤炉炊炎勒龙炸点身躬炼龟躲勇龄勉躺炮炭励劲劳商眠易眯星眨啊昆昂昌眼昏明啦省显昼看眉春良帜类测浊伪帘舒洲体何余活佛舞作舟洽派平悉辨辩叛辬厦返燃想近运惰违远迟连这还惹进咐裤柄直裹盯咏目柜和染裳某柔盘咸盛咽盟盐阀阁栗阅神祝桨陵祖陷蝇桥陶档险陪除桶陡院恭鹿医区匹恩恨恢鹰轿煮载鹊轻煤包匆照鹅鹂梨寸对梯融寿难导梳禁械寨福梁寒隐梅隔离隙严引两丧汇汁荣弓荡丢求中药弟汉个弄临荷汗吊合吉后束杜同名条饲杠饱血饰吵来饶吴吹饺较悦叶号辅熔辆辈辉您司麻叹熟叼悬辱辰参悔架皆皂睡晒晓督晕唇唉晚睬西唐晃晋晌着睁晶滑至翠郁臶滔臵致滨滩都臂满滤滥部翁翅滴羽涂信粱芦浴带众海伐休籍席帮伞伟浸优伙艘会址均用甩坊搜搞坏坑由搁田坐申搂甲搅电块男让疼议讯疾域训订疲计骑骗认撇吓权衡杂衣向厨迅惧燕过迁惠惯县迎惭迈去惨惩迷惕厅燥黄斥斧方园施誓新因璃团四回文囊料斜斑斗畅圣倒捆牵物捞损倍牢捐牧捕牙牛债值倾据捡换豆很泛律人法待径征往亲今介沫从仍忽什没仁仆摔略圆圈摘番摄警摇摆土摊坡携甚甘生搭搬甜烟势烘烛务加劣烂助动烈劫努懂办功劝力烧烦竿母墨闪立门闯问蓝闭闲闷间竖蓄闻站闸毫闹赌扭赏扬扣执资投抗趴抖准足净鲁抓环减玩凉奏蔽笨奉奋符奇好笛横她奸奶奴笔女笑模笋奥汪三弹丈弦世且荐专荒张丑弯东丝汽业丛丘丙鞠榴蚕嫩'
const writerContainer = ref(null)
const writer = ref(null)
const pinyinText = ref('')
const animationId = ref(0)
let strokes = []
let char = ref('')
// let words = ref(["她倾听着窗外的雨声，心情渐渐平静下来。", "他倾尽全力完成了这项艰巨的任务。", "夕阳西下，金色的光芒倾洒在湖面上，美不胜收。"])
let words = ref([])
const audio = ref(null)

const getRandomChar = () => {
  const idx = Math.floor(Math.random() * commonChars.length)
  return commonChars[idx]
}


async function refreshChar() {
  char.value = getRandomChar()
  animationId.value++
  const currentId = animationId.value

  const py = pinyin(char.value, { style: pinyin.STYLE_TONE })
  pinyinText.value = py.length > 0 ? py[0][0] : ''

  const response = await axios.get('/ai-api/ai/getWords', {
    params: {
      word: char.value
    }
  });
  words.value = response.data.data.text.slice(1);

  // 如果之前有音频，先暂停并释放
  if (audio.value) {
    audio.value.pause()
    audio.value.src = ''
    audio.value = null
  }

  // 创建新的Audio对象赋值给audio ref
  audio.value = new Audio("/ai-api/" + response.data.data.url)
  audio.value.preload = 'auto'

  audio.value.addEventListener('ended', () => {
    setTimeout(() => {
      audio.value.play()
    }, 2000)
  })

  if (writerContainer.value) {
    writerContainer.value.innerHTML = ''
  }

  writer.value = HanziWriter.create(writerContainer.value, char.value, {
    width: 400,
    height: 400,
    showOutline: true,
    showCharacter: false
  })

  HanziWriter.loadCharacterData(char.value).then(charData => {
    strokes = charData.strokes
    // playStrokes1(currentId)
    playStrokes2(currentId)
  })

  audio.value.play()

}
function speak(text) {
  return new Promise(resolve => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onend = resolve
    speechSynthesis.speak(utterance)

  })
}
async function playStrokes1(id) {
  while (id === animationId.value) {

    // 朗读当前字
    await speak(char.value)
    for (const w of words.value) {
      if (id === animationId.value) {
        await speak(w)
      }
    }
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}

async function playStrokes2(id) {
  while (id === animationId.value) {
    writer.value.hideCharacter()
    for (let i = 0; i < strokes.length; i++) {
      if (id !== animationId.value) return
      await new Promise(resolve => {
        writer.value.animateStroke(i, { onComplete: resolve })
      })
    }
    await new Promise(resolve => setTimeout(resolve, 1500))
  }
}
</script>

<style>
.app {
  text-align: center;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.writer {
  width: 400px;
  height: 400px;
}

.pinyin {
  margin-top: 20px;
  font-size: 3.5rem;
  font-weight: 700;
  color: #2c3e50;
  font-family: 'Noto Serif SC', serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.words {
  text-align: left;
  margin-top: 10px;
  font-size: 2rem;
  font-weight: 400;
  color: #2c3e50;
  font-family: 'Noto Serif SC', serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.refresh-btn {
  margin-top: 40px;
  padding: 16px 48px;
  font-size: 1.5rem;
  font-weight: 600;
  background-color: #409eff;
  border: none;
  border-radius: 30px;
  color: white;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(64, 158, 255, 0.5);
  transition: background-color 0.3s ease;
}

.refresh-btn:hover {
  background-color: #66b1ff;
}
</style>