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
result.inspectErr(() => { console.warn("seems there was an error")})
if (result.isOk()) {
  console.log(result.val)
} else {
  console.log("error is", result.val.message)
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

result.expect("=======failed to read file=====")
if (result.isErr()) {
  result.expect("this returns nothing and throws an error (never)")
}