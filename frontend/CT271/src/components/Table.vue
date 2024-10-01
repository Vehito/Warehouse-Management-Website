<script>
    export default {
        props: {
            name: { type: String, default: "" },
            tableHeaders: { type: Array, default: [] },
            tableRows: { type: Array, default: [] }
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
                >
                    {{ tableRow[header.key] }}
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
