<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
      ><img :src="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
        class="author"
        >{{ article.author.username }}</nuxt-link
      >
      <span class="date">{{ article.createdAt | date("MMM DD, YYYY") }}</span>
    </div>

    <span v-if="!isAuthor">
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{ active: article.author.following }"
        @click="onFollow(article.author)"
      >
        <i class="ion-plus-round"></i>
        &nbsp; Follow {{article.author.username}}
      </button>
      &nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{ active: article.favorited }"
        :disabled="article.favoriteDisabled"
        @click="onFavorite(article)"
      >
        <i class="ion-heart"></i>
        &nbsp; Favorite Post
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </span>
    <span v-else>
      <nuxt-link
        class="btn btn-outline-secondary btn-sm"
        :to="{
          name: 'editor',
          params: {
            slug: article.slug,
          },
        }"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>

      <button
        class="btn btn-outline-danger btn-sm"
        :class="{ disabled: article.isDeleting }"
        @click="handleDelete(article)"
      >
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </span>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { deleteArticle, deleteFavorite, addFavorite, addFollow, deleteFollow } from '@/api/article'
export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  mounted () {
    this.article.favoriteDisabled = false
    this.article.followDisabled = false
  },
  computed: {
    ...mapState(["user"]),
    isAuthor () {
      return this.article.author.username === this.user?.username
    }
  },
  methods: {
    async handleDelete(article) {
      this.article.isDeleting = true
      await deleteArticle(article.slug)
      this.article.isDeleting = false
      this.$router.push('/')
    },
    async onFavorite (article) {
      if (!this.user ) return this.$router.push('/login')
      article.favoriteDisabled = true // 禁用点击
      if(article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount -= 1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    },
    async onFollow (author) {
      if (!this.user ) return this.$router.push('/login')
      author.followDisabled = true
      if(author.following) {
        // 取消点赞
        await deleteFollow(author.username)
        author.following = false
      } else {
        // 添加点赞
        await addFollow(author.username)
        author.following = true
      }
      author.followDisabled = false // 允许点击
    }
  },
};
</script>
