
export const logger = ( req, res, next ) => {

    const currentDate = new Date();

    console.log( `${req.method} ${req.url} at ${ currentDate.toLocaleTimeString() }`  )

    next()
}