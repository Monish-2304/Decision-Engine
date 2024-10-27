Live Url: https://decisionengine.onrender.com/
## Problem Statement
A Rule/Decision engine that takes rule as input , creates a Abstract Syntax Trees which is displayed to the user. User can also evaluate any data for given rule and results are displayed 
in form of AST.

## Technology tools/components used
- React.Js
- Node.Js 
- Express
- MongoDb
- Tailwind Css

## Getting Started

### How to run this project:

1. Clone the repository from GitHub:
```bash
https://github.com/Monish-2304/Decision-Engine
```
2. Install dependencies for both frontend and backend:

```bash
cd backend
npm install
```
```bash
cd frontend
npm install
```
3. Setup MongoDb Atlas and paste the MongoDb_Uri string in .env file

4. Sample .env for backend:
```
PORT=5001
MONGO_CONNECTION_URI=paste_uri_here
```
5. Also make sure to replace BASE_API_URL in constants/url.constants.js to "http://localhost:5001/api"

5. For running the engine, navigate to the `backend` directory :

```bash
cd backend
npm run dev
```
5. For running the frontend , navigate to the `frontend` directory and start the app: Preferably on port 5173

```bash
cd frontend
npm run dev
```
### Features implemented:

1. User can create a rule to determine user eligibility based on attributes like age, department, income etc. Create rule function is implemented that takes a string representing a rule 
(as shown in the examples) and returns a Node object representing the corresponding AST.

2. Each rule is converted into a AST to represent conditional rules and stored in database with a unique name.

3. A data structure was defined to create AST’s.

4. Evaluate Rule functionality is implemented which accepts data in JSON format , evaluates it using the AST of rule and displays the results.

5. All rules created are displayed in Rules Page , each of which are clickable. When user clicks on a rule , its rule string, meta data and AST is displayed. User can also evaluate any 
data here.

6. Combine Rules functionality is implemented when intakes 2 or more rule strings , combines them in a optimized manner also checking for redundancy using various optimizations and
returns root node of combined rules AST.

7. A help page is provided which explains in detail about rule engine.

8. Error validation is done on rule strings.

Note: All 4 test cases were tested and were successful.








