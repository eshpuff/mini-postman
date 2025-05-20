// habilita ou desabilita o campo body
function toggleBodyInput() {
  const method = document.getElementById("method").value;
  const bodyInput = document.getElementById("requestBody");
  const label = document.getElementById("bodyLabel");

  //só mostra se o metodo for post ou put
  if (method === "POST" || method === "PUT") {
    bodyInput.style.display = "block";
    label.style.display = "block";
  } else {
    bodyInput.style.display = "none";
    label.style.display = "none";
  }

}

async function sendRequest() {
  const url = document.getElementById('url').value;
  const method = document.getElementById('method').value;
  const bodyMessage = document.getElementById('requestBody').value;

  let options = {
    method,
    headers: {}
  };

  if (method === "POST" || method === "PUT") {
    try {
      options.body = JSON.stringify(JSON.parse(bodyMessage)); //verifica se eh um json válido
      options.headers["Content-Type"] = "application/json";
    } catch (e) {
      document.getElementById('statusDisplay').textContent = 'o formato JSON está errado.';
      return;
    }
  }

  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get("content-type");

    let body;
    if (contentType && contentType.includes("application/json")) {
      body = await response.json();
      body = JSON.stringify(body, null, 2);
    } else {
      body = await response.text();
    }

    //pega os headers
    const headers = [...response.headers.entries()]
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');

    //mostra o status 
    document.getElementById('statusDisplay').innerHTML = `<strong>status:</strong> <span style="color: ${response.ok ? 'green' : 'red'};"> ${response.status} ${response.statusText} </span>`;

    //mostra as headers na sua aba
    document.getElementById('headersTab').textContent = headers;
    //mostra os bodys na sua aba
    document.getElementById('bodyTab').textContent = body;

    showTab('body');

  } catch (error) {
    //debug de erro
    document.getElementById('statusDisplay').textContent = 'erro: ' + error.message;
  }
}

// alterna entre as abas body e headers
function showTab(tab) {
  document.getElementById('headersTab').style.display = tab === 'headers' ? 'block' : 'none';
  document.getElementById('bodyTab').style.display = tab === 'body' ? 'block' : 'none';
}

