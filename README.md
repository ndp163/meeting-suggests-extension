<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <a href="https://github.com/ndp163/meeting-suggests-extension">
    <img src="images/icon.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">AI meeting</h3>

  <p align="center">
    An AI meeting for chrome extension, assistant for your work!
    <br />
    <br />
    <a href="https://github.com/ndp163/meeting-suggests-extension">View Demo</a>
    ·
    <a href="https://github.com/ndp163/meeting-suggests-extension/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/ndp163/meeting-suggests-extension/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<details>
  <summary style="font-size: 20px;">Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#feature">Feature</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#setup-backend">Setup Backend</a></li>
        <li><a href="#build-chrome-extension">Build Chrome Extension</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#disclaimer">Disclaimer</a></li>
  </ol>
</details>
<br>

# About The Project

![Product Name Screen Shot][product-screenshot]

During work, we may have difficulty communicating between different languages, or sometimes after each discussion, we cannot remember all the content.

So I created this chrome extension to support us in meetings, helping us solve the above problems with the following main features:
- Transcribe speech to text real-time.
- Store history meetings.
- Summary meetings.

**Note**: The tool only supports Google Meet.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Feature
- Transcribe speech to text real-time.
- Translate to Vietnamese.
- Suggest answers.
- Store history meetings.
- Summary meetings content.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Built With


* [![Express][Express.js]][Express-url]
* [![Plasmo][Plasmo]][Plasmo-url]
* [![OpenAI][OpenAI]][OpenAI-url]
* [![Azure][Azure]][Azure-url]
* [![Langchain][Langchain]][Langchain-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Getting Started

Let's follow below step to run the project.

## Prerequisites

1. [Node.js](https://nodejs.org/en/)
2. [Open AI Key](https://platform.openai.com/docs/api-reference/introduction)
3. [Azure AI Speech](https://azure.microsoft.com/en-us/products/ai-services/ai-speech)
    1. Speech key
    2. Speech region

## Setup Backend

1. Go inside **backend** folder
   ```bash
   cd backend
   ```
2. Create **.env** file with following variables:
    - OPENAI_KEY
    - SPEECH_KEY
    - SPEECH_REGION

### Development

1. Install NPM packages

   ```bash
   npm install
   ```
2. Start backend

   ```bash
   yarn dev
   ```
### Production

1. Install NPM packages
   ```bash
   npm install --production
   ```

1. Build source

   ```bash
   yarn build
   ```
2. Start backend

   ```bash
   yarn prod
   ```

## Build Chrome Extension

1. Go inside **meeting-translator** folder

   ```bash
   cd meeting-translator
   ```

2. Install NPM packages

   ```bash
   npm install
   ```
### Development

1. Build source

   ```bash
   yarn dev
   ```
2. Remove "side_panel" attribute in ***manifest.json*** file

    - Open "***build/chrome-mv3-dev/manifest.json***" folder
    - Remove "side_panel" attribute

### Production

1. Build source

   ```bash
   yarn build
   ```

2. Remove "side_panel" attribute in ***manifest.json*** file

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Usage

- Import the built extension in your Google Chrome web browser.
- Join a meeting of **Google Meet**.
- Open the participants list side panel.
- Open our chrome extension and use it.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


# Disclaimer
All of this comes without any warranty nor any promise of fixing problems or maintaining compatibility with the code it uses. However, bug reports, issues, and advanced pull requests are welcome.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/ndp163/meeting-suggests-extension.svg?style=for-the-badge
[contributors-url]: https://github.com/ndp163/meeting-suggests-extension/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ndp163/meeting-suggests-extension.svg?style=for-the-badge
[forks-url]: https://github.com/ndp163/meeting-suggests-extension/network/members
[stars-shield]: https://img.shields.io/github/stars/ndp163/meeting-suggests-extension.svg?style=for-the-badge
[stars-url]: https://github.com/ndp163/meeting-suggests-extension/stargazers
[issues-shield]: https://img.shields.io/github/issues/ndp163/meeting-suggests-extension.svg?style=for-the-badge
[issues-url]: https://github.com/ndp163/meeting-suggests-extension/issues
[license-shield]: https://img.shields.io/github/license/ndp163/meeting-suggests-extension.svg?style=for-the-badge
[license-url]: https://github.com/ndp163/meeting-suggests-extension/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/ndp163
[product-screenshot]: images/meeting-history.png
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express-url]: https://expressjs.com/
[Plasmo]: https://img.shields.io/badge/Plasmo-f4f2ff?style=for-the-badge
[Plasmo-url]: https://plasmo.com/
[OpenAI]: https://img.shields.io/badge/OpenAI-35495E?style=for-the-badge&logo=openai&logoColor=white
[OpenAI-url]: https://openai.com/
[Azure]: https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white
[Azure-url]: https://azure.microsoft.com/en-us
[Langchain]: https://img.shields.io/badge/LangChain-35495E.svg?style=for-the-badge&logo=langchain&logoColor=#1C3C3C
[Langchain-url]: https://js.langchain.com/v0.2/docs/introduction/