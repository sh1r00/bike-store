<template>
  <section>
    <ul v-for="item in siteMap" :key="item.id" class="siteMap">
      <li>
        <a :href="item.link">
          {{ item.name }}
        </a>
      </li>
    </ul>
    <ul v-for="item in socialLinks" :key="item.id" class="socialLinks">
      <li>
        <a :href="item.link"> 
          {{ item.name }}
        </a>
      </li>
    </ul>
    <ul>
      <h4>Newsletter:</h4>
      <input type="text">
    </ul>
  </section>
</template>

<script>
export default {
  data() {
    return {
      siteMap: [
        {
          name: 'About',
          link: '/about'
        },
        {
          name: 'Company',
          link: '/Company'
        },
        {
          name: 'Locations',
          link: '/locations'
        },
        {
          name: 'Contact',
          link: '/contact'
        },
        {
          name: 'Hours',
          link: '/hours'
        }
      ],
      socialLinks: [
        {
          name: 'Twitter',
          link: 'twitter link'
        },
        {
          name: 'Instagram',
          link: 'instagram link'
        },
        {
          name: 'Facebook',
          link: 'facebook link'
        },
        {
          name: 'LinkedIn',
          link: 'linkedIn link'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
section {
  width: 80%;
  margin-left: 10%;
  padding: 40px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

ul {
  list-style: none;
  padding-left: 0;
}

input {
  width: 100%;
}

@media screen and (min-width: 850px) {
  section {
    padding: 40px !important;
  }
}
</style>
