<template>
  <div class="home">
    <div class="row">
      <div class="col-12">
        <h1 class="mb-4">Welcome!</h1>
        <p class="lead mb-4">Just simple input data application</p>
        
        <div class="d-flex gap-3">
          <router-link to="/users" class="btn btn-primary">
            View Users
          </router-link>
          <router-link to="/users/new" class="btn btn-success">
            Add New User
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>