<template>
  <div class="article-page">

  <div class="banner">
    <div class="container">

      <h1>{{article.title}}</h1>

      <ArticleMeta :article="article"/>

    </div>
  </div>

  <div class="container page">

    <div class="row article-content">
      <div class="col-md-12" v-html="article.body">
      </div>
      <ul class="tag-list">
        <li class="tag-default tag-pill tag-outline" v-for="tag in article.tagList" :key="tag">
          {{tag}}
        </li>
      </ul>
    </div>

    <hr />

    <div class="article-actions">
      <ArticleMeta :article="article"/>
    </div>

    <div class="row">

      <div class="col-xs-12 col-md-8 offset-md-2">
          <ArticleComment v-if="user" :article="article" />
          <ArticleUnlogin v-else />
      </div>

    </div>

  </div>

</div>
</template>

<script>
import { mapState } from 'vuex'
import MarkdownIt from 'markdown-it'
import { getArticle } from '@/api/article'
import ArticleMeta from './components/article-meta'
import ArticleComment from './components/article-comment'
import ArticleUnlogin from './components/article-unlogin'
export default {
  name: 'ArticleIndx',
  components: {
    ArticleMeta,
    ArticleComment,
    ArticleUnlogin
  },
  async asyncData ({ params }) {
    const { data } = await getArticle(params.slug)
    const { article } = data
    const md = new MarkdownIt()
    article.body = md.render(article.body)
    return {
      article: article
    }
  },
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  },
  computed: {
    ...mapState(['user'])
  },
}
</script>