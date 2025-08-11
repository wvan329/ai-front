<template>
  <button @click="playAudio">点击播放音频</button>
</template>

<script setup>


const playAudio = () => {
  const audio = new Audio("/ai-api/ai/audio/wome.mp3")
  audio.preload = 'auto'

  audio.addEventListener('ended', () => {
    setTimeout(() => {
      audio.play()
    }, 2000)
  })
  audio.play()
}
</script>

<style scoped></style>
