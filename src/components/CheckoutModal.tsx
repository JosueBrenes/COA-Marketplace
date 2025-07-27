"use client"

import React, { useState } from 'react'
import { X, CreditCard, Shield, Check, AlertCircle } from 'lucide-react'
import { CartItemType } from '@/types/marketplace'
import { Button } from '@/components/ui/button'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItemType[]
  onPurchaseComplete: () => void
}

interface PaymentMethod {
  id: string
  name: string
  type: 'credit' | 'crypto' | 'digital'
  icon: string
  fee: number
}

const paymentMethods: PaymentMethod[] = [
  { id: 'credit', name: 'Credit Card', type: 'credit', icon: '💳', fee: 0.03 },
  { id: 'bitcoin', name: 'Bitcoin', type: 'crypto', icon: '₿', fee: 0.01 },
  { id: 'ethereum', name: 'Ethereum', type: 'crypto', icon: 'Ξ', fee: 0.015 },
  { id: 'arcanis', name: 'Arcanis Credits', type: 'digital', icon: '🔮', fee: 0 },
]

export function CheckoutModal({ isOpen, onClose, cartItems, onPurchaseComplete }: CheckoutModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState<string>('')
  const [billingInfo, setBillingInfo] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    zip: '',
    country: ''
  })
  const [processing, setProcessing] = useState(false)
  const [purchaseComplete, setPurchaseComplete] = useState(false)

  if (!isOpen) return null

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const selectedMethod = paymentMethods.find(m => m.id === selectedPayment)
  const processingFee = selectedMethod ? subtotal * selectedMethod.fee : 0
  const total = subtotal + processingFee

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePurchase = async () => {
    setProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setProcessing(false)
    setPurchaseComplete(true)
    
    // Wait a moment then complete
    setTimeout(() => {
      onPurchaseComplete()
      onClose()
      setPurchaseComplete(false)
      setCurrentStep(1)
    }, 2000)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-orbitron text-primary">Order Review</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-secondary rounded-lg cyberpunk-border">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded pixelated"
                  />
                  <div className="flex-1">
                    <h4 className="font-orbitron text-foreground">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-mono">Qty: {item.quantity}</span>
                      <span className="text-primary font-mono">${item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">${subtotal}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-primary font-mono">${subtotal}</span>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-orbitron text-primary">Payment Method</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg cyberpunk-border cursor-pointer transition-all ${
                    selectedPayment === method.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-mono text-foreground">{method.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {method.fee > 0 ? `${(method.fee * 100).toFixed(1)}% fee` : 'No fees'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-orbitron text-foreground">Billing Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={billingInfo.email}
                  onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                  className="px-3 py-2 bg-card border border-border rounded cyberpunk-border text-foreground"
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={billingInfo.name}
                  onChange={(e) => setBillingInfo({...billingInfo, name: e.target.value})}
                  className="px-3 py-2 bg-card border border-border rounded cyberpunk-border text-foreground"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={billingInfo.address}
                  onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                  className="col-span-2 px-3 py-2 bg-card border border-border rounded cyberpunk-border text-foreground"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={billingInfo.city}
                  onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                  className="px-3 py-2 bg-card border border-border rounded cyberpunk-border text-foreground"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={billingInfo.zip}
                  onChange={(e) => setBillingInfo({...billingInfo, zip: e.target.value})}
                  className="px-3 py-2 bg-card border border-border rounded cyberpunk-border text-foreground"
                />
              </div>
            </div>

            {selectedMethod && (
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">${subtotal}</span>
                </div>
                {processingFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span className="font-mono">${processingFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary font-mono">${total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-orbitron text-primary">Confirm Purchase</h3>
            
            <div className="bg-secondary p-4 rounded-lg cyberpunk-border">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-orbitron text-foreground">Secure Transaction</p>
                  <p className="text-sm text-muted-foreground">256-bit SSL encryption</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span>{selectedMethod?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email</span>
                  <span>{billingInfo.email}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <p className="text-sm text-yellow-200">
                  Digital items will be delivered instantly to your account upon payment confirmation.
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (purchaseComplete) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card rounded-lg max-w-md w-full p-8 cyberpunk-border neon-glow text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 neon-glow">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-orbitron text-primary mb-2">Purchase Complete!</h2>
          <p className="text-muted-foreground mb-4">Your items have been added to your inventory.</p>
          <p className="text-sm text-muted-foreground">Transaction ID: #ARC{Date.now().toString().slice(-6)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto cyberpunk-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-orbitron text-primary">Checkout</h2>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono ${
                    step <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-muted-foreground'
                  }`}>
                    {step < currentStep ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-8 h-px ${
                      step < currentStep ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {processing ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-orbitron text-primary mb-2">Processing Payment...</h3>
              <p className="text-muted-foreground">Please do not close this window</p>
            </div>
          ) : (
            renderStepContent()
          )}
        </div>

        {/* Footer */}
        {!processing && (
          <div className="flex justify-between p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onClose : handlePreviousStep}
              className="cyberpunk-border"
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            <Button
              onClick={currentStep === 3 ? handlePurchase : handleNextStep}
              disabled={
                (currentStep === 2 && (!selectedPayment || !billingInfo.email || !billingInfo.name)) ||
                (currentStep === 3 && !selectedPayment)
              }
              className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow"
            >
              {currentStep === 3 ? (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Complete Purchase
                </>
              ) : (
                'Next'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}