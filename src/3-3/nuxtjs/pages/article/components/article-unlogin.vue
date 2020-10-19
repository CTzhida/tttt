<template>
  <div>
    <div class="col-xs-12 col-md-8 offset-md-2">
      <div show-authed="true" style="display: none;">
        <list-errors from="$ctrl.commentForm.errors" class="ng-isolate-scope"
          ><ul class="error-messages ng-hide" ng-show="$ctrl.errors">
            <!-- ngRepeat: (field, errors) in $ctrl.errors -->
          </ul>
        </list-errors>
        <form
          class="card comment-form ng-pristine ng-valid"
          ng-submit="$ctrl.addComment()"
        >
          <div class="card-block">
            <textarea
              class="form-control ng-pristine ng-untouched ng-valid ng-empty"
              placeholder="Write a comment..."
              rows="3"
              ng-model="$ctrl.commentForm.body"
            >
            </textarea>
          </div>
          <div class="card-footer">
            <img class="comment-author-img" />
            <button class="btn btn-sm btn-primary" type="submit">
              Post Comment
            </button>
          </div>
        </form>
      </div>

      <p show-authed="false" style="display: inherit;">
        <nuxt-link to="/login">Sign in</nuxt-link> or
        <nuxt-link to="/register">sign up</nuxt-link> to add comments
        on this article.
      </p>

    </div>
  </div>
</template>

<script>
export default {
  name: "ArticleUnlogin",
};
</script>
