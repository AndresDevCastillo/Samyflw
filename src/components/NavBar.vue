<template>
    <header class="header nav">
        <Menubar :model="items" class="navBarInicio">
            <template #start>
                <img src="../assets/img/tinder.png" alt="Logo" srcset="../assets/img/tinder.png">
            </template>
            <template #end>
                <svg id="escudo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000" width="32px"
                    height="32px">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z" />
                </svg></template>
        </Menubar>
    </header>
</template>
<script>

export default {
    data: () => ({
        items: [
            /*  {
                 label: 'Home',
                 icon: 'pi pi-home'
             }, */

        ]
    })

}
</script>
<style>
#escudo path {
    fill: #000;
    transition: fill .3s ease;
}

#escudo:hover path {
    fill: #F64F72;
}
</style>