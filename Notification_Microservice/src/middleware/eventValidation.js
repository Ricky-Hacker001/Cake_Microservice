const validateOrderCompletedEvent = (event) => {

    if(!event){
        return {
            valid: false,
            message: "Event is empty"
        }
    }
    if(event.event !== "ORDER_COMPLETED"){
        return {
            valid: false,
            message: "Invalid event type"
        }
    }
    if(!event.orderId || typeof event.orderId !== "string"){
        return {
            valid: false,
            message: "Invalid orderId"
        }
    }
    if(!event.customerName || typeof event.customerName !== "string"){
        return {
            valid: false,
            message: "Invalid customerName"
        }
    }
    if(!event.email || typeof event.email !== "string"){
        return {
            valid: false,
            message: "Invalid email"
        }
    }
    if(typeof event.totalPrice !== "number" || event.totalPrice < 0){
        return {
            valid: false,
            message: "Invalid totalPrice"
        }
    }
    return {
        valid: true
    }
}

module.exports = validateOrderCompletedEvent