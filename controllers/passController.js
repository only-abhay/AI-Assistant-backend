
import PassModel from "../models/PassModel.js"
import razorpay_instance from "../config/razorpay.js";
import crypto from "crypto";




const createpass = async (req,res)=>{
const id = req.id
const {plan} = req.body
const idempotencyKey = req.idempotencyKey
const amountInRupees = 299
const amountInPaise = amountInRupees * 100

try {

if(plan == "Free"){
    // Check if the user already has a Free plan
    const existingPass = await PassModel.findOne({ userId: id });
    console.log("Existing Pass hai:", existingPass);
    if (existingPass) {
      if (existingPass.plan == 2) {
        return res.status(400).json({
          success: false,
          message: "You already have a Pro plan.",
        });
      }else if (existingPass.plan == 1) {
        return res.status(400).json({
          success: false,
          message: "You already have a Free plan.",
        });
      }
    }

const Pass = await PassModel.create({
    userId:id,
    plan:1,
    Idempotency_Key:idempotencyKey
})
res.status(200).json({
    success:true,
    Pass:Pass
})
}else if(plan == "Pro"){
  const options = {
      amount:amountInPaise,
      currency: "INR",
      receipt: `Order_${id}`,
    };

    const existingPass = await PassModel.findOne({ userId: id });
    if (existingPass) {
      return res.status(400).json({
        success: false,
        message: "You already have a Pro plan.",
      });
    }
    const razorpayOrder = await razorpay_instance.orders.create(options);
    
    await PassModel.create({
    userId:id,
    plan:2,
    razorpayOrderId:razorpayOrder.id,
    Idempotency_Key:idempotencyKey,
    })
      return res.status(200).json({
  success: true,
  message: "Order created successfully.",
  razorpayOrderId: razorpayOrder.id,
  amount: amountInPaise,
});
}

return res.status(400).json({
  success: false,
  message: "Invalid plan",
});
} catch (error) {
    console.error("Create pass error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create payment order",
    });
}
    
    
}

const verifypayment=async (req,res)=>{
 try {
      const { rozarpay_response } = req.body;
     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = rozarpay_response;
     const id = req.id
     const generated_signature = crypto
      .createHmac("sha256", process.env.ROZARPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

       if (generated_signature !== razorpay_signature) {
         return res.status(400).json({
           success: false,
           message: "Invalid payment signature",
         });
       }

  const Pass = await PassModel.findOne({
    userId: id,
    razorpayOrderId: razorpay_order_id,
  });

  if (!Pass) {
    return res.status(404).json({
      success: false,
      message: "Payment order not found",
    });
  }

         Pass.paymentStatus = 1; // Payment Done
         Pass.razorpayPaymentId = razorpay_payment_id;
         Pass.amount = 299;
         Pass.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now  
         await Pass.save();

         res.status(200).json({
          success: true,
          message: "Payment verified and order updated successfully.",
        });


 } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to verify payment",
    });
 }
}
export{
    createpass,
    verifypayment
}