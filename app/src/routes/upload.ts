import Elysia, { t } from "elysia";
import fs from "fs"
import path from "path"
import { exec } from "child_process";
import AdmZip from "adm-zip";
import { promisify } from "util";


const execAsync = promisify(exec);

export const uploadRoutes = new Elysia({prefix: "/upload"})
.post("/upload", async({body}) =>{
  const file = body.file as File

  const projectName = file.name.split(".")[0];

  const projectPath = path.join("projects", projectName)
  fs.mkdirSync(projectPath, { recursive: true });
  fs.mkdirSync("temp", { recursive: true });
  const tempPath = path.join("temp", file.name);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(tempPath, buffer);
  const zip = new AdmZip(tempPath);
  zip.extractAllTo(projectPath, true); 

  try{
    await execAsync("npm install", { cwd: projectPath });
    await execAsync("npm run build", { cwd: projectPath });

  }catch(error){
    console.log("Failed while building Project", error)
  }

  fs.unlinkSync(tempPath);
  
  const caddyConfig = `
  :8080 {
      root * C:/Users/Henri/Videos/selfhostly/app/projects/${projectName}/${projectName}/out
      file_server
      try_files {path} /index.html
  }
`

  fs.writeFileSync(path.join(__dirname, "../caddy/Caddyfile"), caddyConfig)
  const caddyExe = "C:\\Program Files\\Caddy\\caddy.exe";
  const caddyfilePath = path.resolve(__dirname, "../caddy/Caddyfile");

  exec(`"${caddyExe}" reload --config "${caddyfilePath}"`, (err, stdout, stderr) => {
    if(err) console.error("Caddy reload error:", err)
    else console.log("Caddy reloaded:", stdout)
  })

  return {success: true, done: true}
},{
  body: t.Object({
    file: t.File({
      maxSize: 600 * 1024 * 1024
    })
  })
})

