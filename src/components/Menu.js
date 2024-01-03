import React from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

class Menu extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        console.log("Menu called")
        return (
            <div>
                <Modal
                    show={true}
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 5,
                        height: 150,
                        width: 500,
                        backgroundColor: "white",
                        borderRadius: "10px",
                        disableAutoFocus: true,
                    }}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderBottom: "none",
                        }}
                    >
                        <Modal.Title
                            style={{ fontFamily: "Futura, sans-serif" }}
                        >
                            Quit Menu
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontFamily: "Futura, sans-serif",
                        }}
                    >
                        Are you sure you want to quit the game? All progress
                        will be lost
                    </Modal.Body>
                    <Modal.Footer
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderTop: "none",
                        }}
                    >
                        <Button
                            onClick={this.props.close}
                            variant="secondary"
                            style={{
                                borderRadius: "20px",
                                backgroundColor: "#FF6F61",
                                color: "white",
                                fontWeight: "bold",
                            }}
                        >
                            Close
                        </Button>
                        &nbsp; &nbsp; &nbsp; &nbsp;
                        <Button
                            onClick={this.props.quit}
                            variant="primary"
                            style={{
                                borderRadius: "20px",
                                backgroundColor: "#FF6F61",
                                color: "white",
                                fontWeight: "bold",
                            }}
                        >
                            Quit
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    show={true}
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 5,
                        height: "auto",
                        width: 500,
                        backgroundColor: "white",
                        borderRadius: "10px",
                        disableAutoFocus: true,
                        padding: "20px",
                    }}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderBottom: "none",
                        }}
                    >
                        <Modal.Title
                            style={{
                                fontFamily: "Futura, sans-serif",
                                fontSize: "24px",
                                fontWeight: "bold",
                            }}
                        >
                            Quit Menu
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            fontFamily: "Futura, sans-serif",
                            marginTop: "20px",
                        }}
                    >
                        <p>
                            Are you sure you want to quit the game? All progress
                            will be lost
                        </p>
                    </Modal.Body>
                    <Modal.Footer
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderTop: "none",
                            marginTop: "20px",
                        }}
                    >
                        <Button
                            onClick={this.props.close}
                            variant="secondary"
                            style={{
                                borderRadius: "10px",
                                backgroundColor: "#FF6F61",
                                color: "white",
                                fontWeight: "bold",
                                marginRight: "20px",
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={this.props.quit}
                            variant="primary"
                            style={{
                                borderRadius: "10px",
                                backgroundColor: "#FF6F61",
                                color: "white",
                                fontWeight: "bold",
                            }}
                        >
                            Quit
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Menu
