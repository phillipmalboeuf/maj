<script lang="ts">
  export let id: string
  export let placeholder: string
  export let name: string
	export let required: boolean

  export let value = undefined
  let uploading = false

  async function change({ target }: { target: HTMLInputElement }) {
    if(target.files[0]?.size > 52428800){
        alert("Veuillez limiter ce fichier à 50MB.")
        target.value = ""
    } else {
      uploading = true

      try {
        const upload = await fetch('https://upload.contentful.com/spaces/hlfxtjh4lx5k/uploads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Authorization': `Bearer ${import.meta.env.VITE_UPLOAD_TOKEN}`
          },
          body: await target.files[0].arrayBuffer()
        })
        value = `${(await upload.json()).sys.id}.${target.files[0].type}.${target.files[0].name}`
      } catch (error) {
        alert(error)
      } 

      uploading = false
    }
  }
</script>

<input {required} on:change={e => {
  // @ts-ignore
  change(e)
}} type="file" {id} {placeholder} disabled={uploading} />
{#if uploading}<p>Téléversement en cours...</p>{/if}
<input type="hidden" {name} {value} />