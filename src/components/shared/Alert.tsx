import { AlertCircleIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function AlertBox() {
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>An error occured!</AlertTitle>
        <AlertDescription>
          <p>Please try again!</p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
