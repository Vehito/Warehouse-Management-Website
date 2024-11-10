<script>
    export default {
        props: {
            name: { type: String, default: "" },
            tableHeaders: { type: Array, default: [] },
            tableRows: { type: Array, default: [] },
            btnContent: {
                type: String, required: false
            }
        },

        emits: ["clickBtn"],

        methods: {
            clickBtn(id) {
                this.$emit('clickBtn', id);
            }
        },
    }
</script>

<template>
    <table class="table table-bordered">
        <thead class="thead-dark">
            <th
                scope="col"
                v-for="(tableHeader, index) in tableHeaders"
                :key="index"
                class="text-center"
            >
                {{ tableHeader.name }}
            </th>

        </thead>

        <tbody>
            <tr
                v-for="(tableRow, index) in tableRows"
                :key="index"
            >
                <th scope="row">
                    {{ tableRow._id }}
                </th>

                <td
                    v-for="(header, index) in tableHeaders.slice(1)"
                    :key="index"
                    :class="typeof(tableRow[header.key]) === 'string' ? 'text-left' : 'text-right'"
                >
                    {{ tableRow[header.key] }}
                </td>

                <td
                    v-if="btnContent"
                >
                    <button
                        class="btn btn-secondary"
                        type="button"
                        @click="clickBtn(tableRow._id)"
                    >
                        <span v-html="btnContent"></span>
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<!-- tableHeaders: [
    { name: "ID", key: "_id" },
    { name: "Tên sản phẩm", key: "name" },
    { name: "Giá", key: "price" }
] -->
