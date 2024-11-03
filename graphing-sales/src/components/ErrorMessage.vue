<template>
    <div v-if="message" class="errorMessage" >
      {{ message }}
    </div>
  </template>
  
  <script>
  export default {
    name: 'ErrorMessage',
    props: {
      message: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .errorMessage {
    margin-top: 20px;
    color: red;
  }
  </style>
  