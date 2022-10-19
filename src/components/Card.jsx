import React from "react";
import {MDBCard, MDBCardBody, MDBCardTitle, MDBBtn, MDBCardImage, MDBCardText} from "mdb-react-ui-kit";

function Card(props){
    return (
        <div>
            <MDBCard className="token img" style={{maxWidth:"22rem"}}>
                <MDBCardImage src={props.dataURL} position="top" style={{marginRight:"4rem", height:"15rem"}}/>
                <MDBCardBody>
                    <MDBCardTitle>{props.name}</MDBCardTitle>
                    <MDBCardText>The KryptoBirdz are 20 uniquely generated from the cyberpunk cloud galaxy Msytopia! There is only one of each bird and each bird can only be owned by a single person on the Ethereum blockchain.</MDBCardText>
                    <MDBBtn href={props.dataURL}>Details</MDBBtn>
                </MDBCardBody>
            </MDBCard>
        </div>
    );
}
export default Card;