<script lang="ts">
   
    let name: string;
    let email: string;
    let summary: string;
    let description: string;
    let sendBrowserInfo: boolean = true;

    //format textarea input to replace textarea "new line" with new line character
    const replaceNewLines = (description: string) => {
      let regex = /[\r\n\x0B\x0C\u0085\u2028\u2029]+/g;
      return description.replace(regex, " \\n ");
    }

    const buildData = () => {
       
        let formattedDescription: string = replaceNewLines(description)
        let userAgent: string = navigator.userAgent;
        let userURL: string = location.href;

        const generalFormData = `{
                "name": "${name}",
                "email": "${email}",
                "summary": "${summary}",
                "description": "${formattedDescription}",
                "userURL": "${userURL}",
                "userAgent": "${userAgent}"
        }` 
        console.log(generalFormData)
        return generalFormData
        
    }

    async function doPost () {
        
         const res = await fetch('http://localhost:5000/api', {
           method: 'POST', 
            body: buildData(),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })

        const json = await res.json()
        console.log(JSON.stringify(json))
        
    }
    const onSubmit = (e) => {
        
        doPost()

    }
</script>

<form on:submit|preventDefault={onSubmit}>
    <p>
      <label for="name">Name: </label>
      <input name="name" id="name" type="name" bind:value={name}/>
    </p>
    <p>
      <label for="email">Email address &ast;</label>
      <input name="email" id="email" type="email" bind:value={email}/>
    </p>
    <p>
      <label for="summary">Short summary &ast;</label>
      <input name="summary" id="summary" type="text" bind:value={summary}/>
    </p>
    <p>
      <label for="description">Full description or question</label>
      <textarea name="description" id="description" bind:value={description}></textarea>
    </p>
    <p>
      <input name="sendBrowserInfo" type="checkbox" id="sendBrowserInfo" bind:checked={sendBrowserInfo} />
      <label for="autoLogin">Send my browser information to help investigate the issue</label>
    </p>
    <p>
      <input class="btn" type="submit" value="Submit" aria-label="Submit" />
    </p>
  </form>