import { PathOrFileDescriptor, readFileSync } from "fs"
import { Result, err, match, ok } from "."

function myReadFileSync(path: PathOrFileDescriptor): Result<string> {
  try {
    const data = readFileSync(path, "utf-8")
    return ok(data)
  } catch (error) {
    return err(error as Error)
  }
}

const result = myReadFileSync("src/index.tsx")
if (result.is_ok()) {
  console.log(result.val)
} else {
  console.log("error is", result.err.message)
}

match(
  result,
  (val) => {
    console.log(val)
  },
  (err) => {
    console.log("error is", err.message)
  }
)
