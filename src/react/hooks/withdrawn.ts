import { useContext, useEffect, useState } from "react"
import { R3vlContext } from ".."

const useBalances = ({ walletAddress }: { walletAddress: string }) => {
  const { client } = useContext(R3vlContext)
  const [withdrawn, setWithdrawn] = useState<number>(0)
  const [withdrawable, setWithdrawable] = useState<number>(0)

  useEffect(() => {
    const requestData = async () => {
      const _withdrawn = await client.withdrawn({ walletAddress })
      const _withdrawable = await client.withdrawable({ walletAddress })

      if (_withdrawn) setWithdrawn(_withdrawn)
      if (_withdrawable) setWithdrawable(_withdrawable)
    }

    requestData()
  }, [])

  return {
    withdrawn,
    withdrawable,
    earnings: withdrawn + withdrawable
  }
}

export default useBalances
