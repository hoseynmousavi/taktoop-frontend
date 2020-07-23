import React from "react"
import {Helmet} from "react-helmet"

const NotFound = () =>
    <div>
        <Helmet>
            <title>تک توپ | 404</title>
            <meta property="og:title" content="تک توپ | 404"/>
            <meta name="twitter:title" content="تک توپ | 404"/>
        </Helmet>
        not found!
    </div>

export default NotFound