<script>
    export default {
        props: {
            items: { type: Array, default: [] },
            activeIndex: { type: Number, default: -1 }
        },
        emits: ["update:activeIndex"],
        methods: {
            updateActiveIndex(index) {
                this.$emit("update:activeIndex", index);
            }
        }
    }
</script>

<template>
    <ul class="list-group d-flex flex-column align-items-center">
        <li class="list-group-item text-left" 
            v-for="(item, index) in items"
            :key="item._id"
            :class="{ active: index === activeIndex }"
            @click="updateActiveIndex(index)"
        >
            {{ item.name }}
        </li>
    </ul>
</template>

<style scoped>
.list-group-item{
    width: 300px;
}
</style>