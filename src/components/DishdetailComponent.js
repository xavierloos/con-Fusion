import React, { Component } from 'react';
import { Card, CardImg, CardBody, CardText, CardTitle, Breadcrumb, BreadcrumbItem, Modal, Button, ModalHeader, ModalBody, Row, Col, Label, ModalFooter } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import {Loading} from './LoadingComponent';
import {baseUrl} from '../shared/baseUrl';
import {FadeTransform, Fade, Stagger} from  'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);


function RenderDish({ dish }){
    // if (dish === undefined) {
    //     return (
    //         <div></div>
    //     );
    // }
    return (
        <div className='col-12 col-md-5 m-1'>
            <FadeTransform in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg top width="100%" src={baseUrl + dish.image} alt={dish.name} />
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>
    );
}

function RenderComments  ({ comments, postComment,dishId }) {
    if (comments != null) {
        return (
            <div className='col-12 col-md-5 m-1'>
                
                <h4> Comments </h4>
                <ul className='list-unstyled'>
                    <Stagger in>
                        {comments.map((comment) => {
                            return (
                                <Fade in>
                                    <li key={comment.id}>
                                        <p>{comment.comment}</p>
                                        <p>Author : {comment.author},{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(new Date(comment.date))}</p>
                                    </li>
                                </Fade>
                            );
                        })}
                    </Stagger>
                </ul>
                <CommentForm  dishId={dishId} postComment={postComment}/>
            </div>
        );
    }
    else{
        return(
            <div></div>
        );
    };
}
class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            isModalOpen: false
        };
    }
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }
    handleSubmit(values) {
        this.toggleModal();
       this.props.postComment(this.props.dishId, values.rating, values.author,values.comment);
    }
    render() {
        return (
            <>
                <Button className="btn-dark btn-block" onClick={this.toggleModal}>
                    <span className="fa fa-pencil fa-lg"></span> Submit Comment
                </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader className="bg-dark light-gray" toggle={this.toggleModal}> 
                        Submit Comment
                    </ModalHeader>
                    <ModalBody>
                        <div className="col-12 col-md-12">
                            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                                <Row className="form-group">
                                    <Label htmlFor="rating" md={10}>Rate this meal</Label>
                                    <Col md={{ size: 12, offset: 0 }}>
                                        <Control.select model=".rating"
                                            className="form-control" name="rating" >
                                            <option>1 - Bad</option>
                                            <option>2 - It's not for me</option>
                                            <option>3 - It's Ok</option>
                                            <option>4 - Delicious</option>
                                            <option>5 - Perfect</option>
                                        </Control.select>
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="name" md={10}>Author</Label>
                                    <Col md={12}>

                                        <Control.text model=".name" id="name" name="name" placeholder="Someone"
                                            className="form-control"
                                            validators={{
                                                required, minLength: minLength(3), maxLength: maxLength(15)
                                            }}
                                        />
                                        <Errors className="text-danger" model=".name" show="touched" messages={{
                                            required: "You're missing this part!",
                                            minLength: 'I guess your name is more thant 2 letters',
                                            maxLength: "It can't be too long, I bet. Try your short name instead."
                                        }}></Errors>
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="message" md={10}>Say it in a few words</Label>
                                    <Col md={12}>
                                        <Control.textarea model=".message" id="message" name="message"
                                            placeholder="We want to here you" rows="6  " className="form-control" />
                                    </Col>
                                </Row>
                                <ModalFooter>
                                    <Row className="form-group">
                                        <Col md={{ size: 12, offset: 0 }}>
                                            <Button type="submit" color="primary">
                                                <span className="fa fa-send fa-lg"></span> Send Comment
                              </Button>
                                        </Col>
                                    </Row>
                                </ModalFooter>
                            </LocalForm>
                        </div>
                    </ModalBody>
                </Modal>
            </>
        );
    };
}
const DishDetail = (props) => {
    if (props.isLoading){
        return(
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }else if(props.errMess){
        return(
            <div className="container">
                <div className="row">
                     <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }else if (props.dish!=null) {
         return (
        <div className="container">
            <div className="row">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <Link to='/menu'>Menu</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        {props.dish.name}
                    </BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr></hr>
                </div>
            </div>
            <div className='row'>
                <RenderDish dish={props.dish}></RenderDish>
                <RenderComments comments={props.comments} postComment={props.postComment} dishId={props.dish.id}></RenderComments>
            </div>
        </div>
        );
    }else{
        return(
            <div></div>
        );
    }
}


export default DishDetail;
