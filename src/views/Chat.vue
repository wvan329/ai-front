<template>
  <div>
    <div v-if="!sessionId">
      <button @click="startChat">开始对话</button>
    </div>

    <div v-else class="chat-container">
      <div class="messages">
        <div v-for="(msg, index) in messages" :key="index" class="message">
          <strong>{{ msg.role }}：</strong> {{ msg.content }}
        </div>
      </div>

      <div class="input-area">
        <input v-model="userInput" @keyup.enter="sendMessage" placeholder="请输入内容..." />
        <button @click="sendMessage">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// UUID生成函数
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// 状态
const sessionId = ref(null)
const userInput = ref('')
const messages = ref([])

// 开始新会话
function startChat() {
  sessionId.value = generateUUID()
}

// 发送消息
async function sendMessage() {
  const input = userInput.value.trim()
  if (!input) return

  // 添加用户消息
  messages.value.push({ role: '用户', content: input })
  userInput.value = ''

  // 发起请求（流式处理 Flux<String>）
  const response = await fetch('https://a.wgk-fun.top/ai-api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId: sessionId.value,
      message: input,
    }),
  })

  if (!response.body) {
    console.error('响应无内容')
    return
  }

  // 流式读取响应
  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let botMsg = ''
  const botMessage = { role: 'AI', content: '' }
  messages.value.push(botMessage)

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    botMsg += chunk
    botMessage.content = botMsg
  }
}
</script>

<style scoped>
.chat-container {
  width: 500px;
  margin: 0 auto;
}
.messages {
  height: 300px;
  border: 1px solid #ddd;
  padding: 10px;
  overflow-y: auto;
  margin-bottom: 10px;
  background: #f9f9f9;
}
.message {
  margin-bottom: 8px;
}
.input-area {
  display: flex;
  gap: 8px;
}
input {
  flex: 1;
  padding: 8px;
}
button {
  padding: 8px 16px;
}
</style>
