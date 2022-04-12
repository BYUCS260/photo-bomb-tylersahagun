<template>
<div>
    <img :src="this.photos.path" width="400" height="375" />
    <div class="photoInfo">
    <h4 class="photoTitle">{{this.photos.title}}</h4>
    <p class ="photoDesc">{{this.photos.description}}</p>
    <p class="photoName">{{this.photos.user.firstName}} {{this.photos.user.lastName}}</p>
    </div>
    <p class="photoDate">{{formatDate(this.photos.created)}}</p>
    <div class="comments">
    <br>
    <h4> Comments: </h4>
    <div v-for="comment in comments" :key="comment.id">
      <p><em>{{comment.desc}}</em> - {{comment.user.firstName}} {{comment.user.lastName}}</p>
      <p class="commentDate">{{formatDate(comment.created)}}</p>
    </div>
    <br>
    <div v-if="user">
       <h4>Add a Comment</h4>
        <div class="form">
          <textarea id="comment" placeholder="Comment"></textarea>
          <br><br>
       </div>
       <button @click="addComment(); getComments()">Post Comment</button>
       <br>
       </div>
    </div>
</div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
export default {
  name: 'Photo-photo',
  data() {
    return{
      id: 0,
      photos: [],
      comments: [],
      error: '',
    }
  },
  async created() {
    this.id = this.$root._route.query.id;
    this.getPhoto();
    this.getComments();
    this.getUser();
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  },
  methods: {
    async getPhoto() {
      try {
        let response = await axios.get("/api/photos/all/" + this.id);
        this.photos = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    formatDate(date) {
      if (moment(date).diff(Date.now(), 'days') < 15)
        return moment(date).fromNow();
      else
        return moment(date).format('d MMMM YYYY');
    },
    async addComment() {
     try {
        let comment = document.getElementById("comment").value;
        await axios.post('/api/comments', {
          desc: comment,
          id: this.id
        });
        document.getElementById("comment").value = "";
      } catch (error) {
        console.log(error);
      }
    },
    async getComments() {
      try {
        let response = await axios.get("/api/comments/" + this.id);
        this.comments = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getUser() {
      try {
        let response = await axios.get('/api/users');
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
  },
}
</script>

<style>
.image {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
}
.image img {
  width: 100%;
}
</style>