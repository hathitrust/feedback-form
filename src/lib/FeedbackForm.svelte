<script lang="ts">

  import '@shoelace-style/shoelace/dist/components/button/button.js';
  import '@shoelace-style/shoelace/dist/components/input/input.js';
  import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
  import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'
   
  let userURL: string = location.href;
  let userAgent: string = navigator.userAgent;
  
  const onSubmit = async () => {
    //shoelace serializer for turning FormData into JSON
    const form = document.querySelector('form')
    const data = serialize(form)

    const res = await fetch('http://localhost:5000/api', {
          method: 'POST', 
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })

        const json = await res.json()
        console.log(JSON.stringify(json))
    }
</script>

<form on:submit|preventDefault={onSubmit}>
   
      <label for="name">Name: </label>
      <sl-input name="name" id="name" type="name" ></sl-input>
    
   
      <label for="email">Email address &ast;</label>
      <sl-input name="email" id="email" type="email" ></sl-input>
   
      <label for="summary">Short summary &ast;</label>
      <sl-input name="summary" id="summary" type="text" ></sl-input>
   
    
      <label for="bookDescription">Description or URL of the book</label>
      <sl-input name="bookDescription" id="bookDescription" type="text" ></sl-input>
     
      <label for="description">Full description or question</label>
      <sl-textarea name="description" id="description" ></sl-textarea>
   
      <input name="userURL" id="userURL" type="hidden" bind:value="{userURL}" />
      <input name="userAgent" id="userAgent" type="hidden" bind:value="{userAgent}" />
    
    
      <sl-button class="btn" type="submit" value="Submit" aria-label="Submit">Submit</sl-button>
   
  </form>