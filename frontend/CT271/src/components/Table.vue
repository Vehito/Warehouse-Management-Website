<script>
    export default {
        props: {
            name: { type: String, default: "" },
            tableHeaders: { type: Array, default: [] },
            tableRows: { type: Array, default: [] },
            btnContents: { type: Array, required: false, default: [] },
            btnStyles: { type: Array, require: false, default: [] }
        },

        emits: ["clickBtn"],

        methods: {
            clickBtn(id, btnIndex) {
                this.$emit('clickBtn', id, btnIndex);
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
                    v-if="btnContents.length > 0 && btnStyles.length > 0"
                >
                    <div 
                        v-for="(btnContent, index) in btnContents"
                        class="d-flex flex-row justify-content-around"
                    >

                        <button
                            :class="btnStyles[index]"
                            class="btn"
                            type="button"
                            @click="clickBtn(tableRow._id, index)"
                        >
                            <span v-html="btnContent"></span>
                        </button>
                    </div>
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
