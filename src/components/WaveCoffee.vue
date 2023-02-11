<template>
  <div class="sample"></div>
</template>
<style scoped>
.sample {
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  margin: 0 auto;
  width: 100%;
  height: 100px;
  background-color: #fff;
}

.sample::before,
.sample::after {
  position: absolute;
  left: -50%;
  width: 300%;
  height: 300%;
  content: "";
  background-color: #3168dd;
  animation: wave linear 10s infinite;
}

.sample::before {
  top: -150%;
  border-radius: 50% 50% / 50% 70%;
}

.sample::after {
  top: -146%;
  border-radius: 30% 70% / 30% 50%;
  opacity: 0.2;
  animation-delay: 0.4s;
}

@keyframes wave {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
