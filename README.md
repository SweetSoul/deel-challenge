# Deel challenge

I've used 94mins for Part 1 and 38mins for Part 2 according to my WakaTime. I've used SASS to easen the style sheet creation and save me some time.

### Improvements for Production
- Implement sanitization with DOMPurify
- Worker to deal with the data filtering (if for whatever reason we need to deal with huge amount of data in FE)

## Running the project

Requirements:
- Node@16.14.2
- NPM@8.5

If you have newer versions you should not find any problem, older versions need an update before moving further.

If you need to update your node, click [HERE](https://nodejs.org/dist/v16.14.2/) and select the version for your system. (If you use Mac or Linux, prefer using your package manager)

If you need to update npm just run at a terminal window:

```cmd
npm i -g update npm@8.5
```

Follow the steps below:

```bash
# 1. Clone the repo
git clone https://github.com/SweetSoul/deel-challenge.git

# 2. Access the folder
cd deel-challenge

# 3. Install the modules
npm i

# 4. Start the server
npm start
```

After that, you should have the app running at your default browser, if you don't, click [HERE](http://localhost:3000)