<template>
  <div class="chat-wrapper">
    <div v-if="!sessionId" class="start-screen">
      <button class="start-button" @click="startChat">开始对话</button>
    </div>

    <div v-else class="chat-container">
      <div class="messages" ref="messageList">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message-bubble"
          :class="msg.role === '用户' ? 'user' : 'ai'"
        >
          <div class="bubble-content">{{ msg.content }}</div>
        </div>
      </div>

      <div class="input-area">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="请输入内容..."
        />
        <button @click="sendMessage">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { reactive } from 'vue'


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

  const url = new URL('https://a.wgk-fun.top/ai-api/ai/chat')
  url.searchParams.append('user', sessionId.value)
  url.searchParams.append('prompt', input)

  const response = await fetch(url, {
    method: 'GET',
  })

  if (!response.body) {
    console.error('响应无内容')
    return
  }

  // 流式读取响应
  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let botMsg = ''
  const botMessage = reactive({ role: 'AI', content: '' }) // ✅ 使其响应式
  messages.value.push(botMessage)

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    botMsg += chunk
    botMessage.content = botMsg // ✅ 页面现在能实时更新
  }
}
</script>

<style scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  background-color: #f5f5f5;
}

.start-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.start-button {
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  background-color: orange;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.chat-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.message-bubble {
  display: flex;
  margin-bottom: 10px;
  max-width: 95%; /* ✅ 从 80% 改成 95% */
  word-wrap: break-word;
}

.message-bubble.user {
  justify-content: flex-end;
  margin-left: auto;
  margin-right: 8px; /* ✅ 靠右边小一点 */
}

.message-bubble.ai {
  justify-content: flex-start;
  margin-right: auto;
  margin-left: 8px; /* ✅ 靠左边小一点 */
}

.bubble-content {
  padding: 10px 14px;
  border-radius: 16px;
  line-height: 1.4;
  font-size: 14px;
  background-color: #e5e7eb;
}

.message-bubble.user .bubble-content {
  background-color: lightcoral;
  color: white;
  border-bottom-right-radius: 2px;
}

.message-bubble.ai .bubble-content {
  background-color: #e5e7eb;
  color: #111827;
  border-bottom-left-radius: 2px;
}

.input-area {
  display: flex;
  padding: 10px;
  background-color: white;
  border-top: 1px solid #ddd;
}

input {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
}

button {
  margin-left: 8px;
  padding: 0 16px;
  font-size: 14px;
  border: none;
  background-color: skyblue;
  color: white;
  border-radius: 20px;
  cursor: pointer;
}

/* 移动端适配 */
@media (max-width: 600px) {
  .chat-wrapper {
    height: 100dvh;
  }

  .bubble-content {
    font-size: 15px;
  }

  input {
    font-size: 16px;
  }

  button {
    font-size: 16px;
  }
}
</style>

