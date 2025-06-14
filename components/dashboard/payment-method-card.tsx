import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Edit, Trash2 } from "lucide-react"

interface PaymentMethodCardProps {
  method: {
    id: number
    type: "Visa" | "Mastercard"
    last4: string
    expiry: string
    isDefault: boolean
    holderName: string
  }
}

export function PaymentMethodCard({ method }: PaymentMethodCardProps) {
  return (
    <Card className="bg-[#212121] border-gray-800">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-[#414141] rounded flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-white">•••• •••• •••• {method.last4}</p>
              <p className="text-sm text-gray-400">
                {method.type} • Expires {method.expiry}
              </p>
              <p className="text-sm text-gray-400">{method.holderName}</p>
            </div>
          </div>
          {method.isDefault && (
            <Badge className="bg-[rgb(54,235,138)]/20 text-[rgb(54,235,138)] border-[rgb(54,235,138)]/30">
              Default
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          {!method.isDefault && (
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
