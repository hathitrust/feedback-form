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
   
      <sl-input class="label-on-left" label="Name" name="name" id="name" type="name" ></sl-input>
    
      <sl-input class="label-on-left" label="Email address" name="email" id="email" type="email" required></sl-input>
   
      <sl-input class="label-on-left" label="Short summary" name="summary" id="summary" type="text" required></sl-input>
   
      <sl-input class="label-on-left" label="Description or URL of the book" name="bookDescription" id="bookDescription" type="text" ></sl-input>
     
      <sl-textarea class="label-on-left" label="Full description of problem or question" name="description" id="description" ></sl-textarea>
   
      <input name="userURL" id="userURL" type="hidden" bind:value="{userURL}" />
      <input name="userAgent" id="userAgent" type="hidden" bind:value="{userAgent}" />
    
      <div class="form-options">
      <sl-button class="btn form-button" variant="default" type="submit" value="Submit" aria-label="Submit">Cancel</sl-button>
      <sl-button class="btn form-button" variant="primary" type="submit" value="Submit" aria-label="Submit">Submit</sl-button>
      </div>
   
  </form>

  <style>
    
  .label-on-left {
      --label-width: 150px;
      --gap-width: 1rem;
    }

    .label-on-left + .label-on-left {
      margin-top: var(--sl-spacing-medium);
    }

    .label-on-left::part(form-control) {
      display: grid;
      grid: auto / var(--label-width) 1fr;
      gap: var(--sl-spacing-3x-small) var(--gap-width);
      align-items: center;
    }

    .label-on-left::part(form-control-label) {
      text-align: right;
    }

    .form-options {
      display: flex;
      justify-content: flex-end;
      gap:10px;
      padding: 1em 0;
    }
  
  </style>