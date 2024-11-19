<script>
    export default {
        props: {
            person: { type: Object, required: true },
        },
    }
</script>

<template>
    <div>
        <div 
            class="p-1"
            v-for="(detail, index) in person"
            :key="index"
        >
            <strong>{{ detail.key }}:</strong>
            {{ detail.value }}
        </div>
    </div>

</template>