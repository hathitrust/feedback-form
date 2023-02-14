<script lang="ts">

  import FormMessage from './FormMessage.svelte';
  import { slide } from 'svelte/transition';
  import '@shoelace-style/shoelace/dist/components/button/button.js';
  import '@shoelace-style/shoelace/dist/components/input/input.js';
  import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
  import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js'
  import '@shoelace-style/shoelace/dist/components/alert/alert.js';
   
  let userURL: string = location.href;
  let userAgent: string = navigator.userAgent;

  //takes long string output of document.cookie and splits it into a usable javascript object
  let cookies: object = document.cookie
  .split(';')
  .map(cookie => cookie.split('='))
  .reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {});

  //if user isn't logged in, HTstatus cookie won't exist
  let userAuthStatus: string = cookies.HTstatus || 'not logged in';

  let postResponseStatusCode;

  // when true, spinner on submit button animates
  let loading = false;
  // when true, hides the element (in this case, the form)
  let hidden = false;
  // when true, shows the success/failure alert message
  let submitted = false;
  
  const onSubmit = async () => {
    loading = true;
    //shoelace serializer for turning FormData into JSON
    const form = document.querySelector('form')
    const data = serialize(form)

    try {
      const res = await fetch('http://localhost:5000/api', {
            method: 'POST', 
              body: JSON.stringify(data),
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              }
          })

      const json = await res.json()
      postResponseStatusCode = res.status;
      loading = false;
      submitted = true;

      if (res.ok) {
        hidden = true;
        console.log(`request created in service desk ${json.serviceDeskId}: ${json.issueKey}`)
        console.log('status code', postResponseStatusCode)
      } else {
        throw new Error(`There was an error posting the form: ${res.status}, ${res.statusText}`)
      }
    } catch(error) {
      loading = false;
      submitted = true;
      console.log(`fetch to /api POST failed: ${error}`)
    }
     
  }

  const startOver = () => {
    //unhide the form, hide the submission message, reset the form
    hidden = !hidden;
    submitted = !submitted;
    document.querySelector('form').reset()
  }
</script>

<main>

  <form on:submit|preventDefault={onSubmit} class:hidden>
    
        <sl-input class="label-on-left" label="Name" name="name" id="name" type="name" ></sl-input>
      
        <sl-input class="label-on-left" label="Email address" name="email" id="email" type="email" required></sl-input>
    
        <sl-input class="label-on-left" label="Short summary" name="summary" id="summary" type="text" required></sl-input>
    
        <sl-input class="label-on-left" label="Description or URL of the book" name="bookDescription" id="bookDescription" type="text" ></sl-input>
      
        <sl-textarea class="label-on-left" label="Full description of problem or question" name="description" id="description" ></sl-textarea>
    
        <input name="userURL" id="userURL" type="hidden" bind:value="{userURL}" />
        <input name="userAgent" id="userAgent" type="hidden" bind:value="{userAgent}" />
        <input name="userAuthStatus" id="userAuthStatus" type="hidden" bind:value="{userAuthStatus}" />
      
        <div class="form-options">
        <sl-button class="btn form-button" variant="default" type="submit" value="Submit" aria-label="Submit">Cancel</sl-button>
        <sl-button class="btn form-button" variant="primary" type="submit" value="Submit" aria-label="Submit" {loading}>Submit</sl-button>
        </div>

    </form>

    <!-- TODO: use props to make these messages more modular <FormMessage /> -->
   {#if submitted}
   <section>
        {#if postResponseStatusCode === 200}
        <div transition:slide>
          <sl-alert variant="success" open>
            <sl-icon slot="icon" name="check2-circle"></sl-icon>
            <strong>Thank you!</strong><br />
            Your feedback has been submitted.
            <sl-button variant="default" on:click={startOver} on:keypress={startOver}><sl-icon slot="suffix" name="arrow-counterclockwise"></sl-icon>Start over</sl-button>
          </sl-alert> 
        </div>
        {:else if postResponseStatusCode === 429}
        <div transition:slide>
          <sl-alert variant="danger" open>
            <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
            <strong>Limit reached</strong><br />
            You have reached the maximum amount of submissions for this time period. Please submit your request again another time.
          </sl-alert> 
        </div>
        {:else}
        <div transition:slide="{{duration: 300}}">
          <sl-alert variant="danger" open>
            <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
            <strong>Oops!</strong><br />
            There was an error submitting the form. Please try again or email us at support@hathitrust.org
          </sl-alert> 
        </div>
        {/if}
      </section>
      {/if}
    </main>

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

    .hidden {
      display:none;
    }
  
  </style>