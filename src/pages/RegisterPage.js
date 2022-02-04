import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

import axios from 'axios';

const RegisterPage = () => {
  let navigate = useNavigate();

  const [stepperInstance, setStepperInstance] = useState(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailAddressHasChanged, setEmailAddressHasChanged] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState({});
  const [username, setUsername] = useState('');
  const [usernameHasChanged, setUsernameHasChanged] = useState(false);
  const [isValidUsername, setIsValidUsername] = useState({});
  const [password, setPassword] = useState('');
  const [passwordHasChanged, setPasswordHasChanged] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordHasChanged, setConfirmPasswordHasChanged] =
    useState(false);
  const emailAddressInputRef = useRef(null);
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  const [firstName, setFirstName] = useState('');
  const [firstNameHasChanged, setFirstNameHasChanged] = useState(false);
  const [middleName, setMiddleName] = useState('');
  const [middleNameHasChanged, setMiddleNameHasChanged] = useState(false);
  const [lastName, setLastName] = useState('');
  const [lastNameHasChanged, setLastNameHasChanged] = useState(false);
  const [gender, setGender] = useState('');
  const [genderHasChanged, setGenderHasChanged] = useState(false);
  const [contactNumber, setContactNumber] = useState('');
  const [contactNumberHasChanged, setContactNumberHasChanged] = useState(false);
  const [telephoneNumber, setTelephoneNumber] = useState('');
  const [telephoneNumberHasChanged, setTelephoneNumberHasChanged] =
    useState(false);
  const firstNameInputRef = useRef(null);
  const middleNameInputRef = useRef(null);
  const lastNameInputRef = useRef(null);
  const contactNumberInputRef = useRef(null);
  const telephoneNumberInputRef = useRef(null);

  const [addressStatus, setAddressStatus] = useState('live');
  const [address, setAddress] = useState('');
  const [addressHasChanged, setAddressHasChanged] = useState(false);
  const [city, setCity] = useState('');
  const [cityHasChanged, setCityHasChanged] = useState(false);
  const [province, setProvince] = useState('');
  const [provinceHasChanged, setProvinceHasChanged] = useState(false);
  const addressInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const provinceInputRef = useRef(null);

  const [hasAgree, setHasAgree] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [attachmentURL, setAttachmentURL] = useState('');

  useEffect(() => {
    const stepperDiv = document.querySelector('.stepper');

    setStepperInstance(
      // eslint-disable-next-line
      new MStepper(stepperDiv, {
        stepTitleNavigation: false
      })
    );

    const elems = document.querySelectorAll('select');

    // eslint-disable-next-line
    M.FormSelect.init(elems, {});

    return () => {};
  }, [setStepperInstance]);

  useEffect(() => {
    const timer = setTimeout(() => {
      validateEmail(emailAddress);
    }, 500);

    return () => clearTimeout(timer);
  }, [emailAddress]);

  useEffect(() => {
    const timer = setTimeout(() => {
      validateUsername(username);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const validateEmail = async (email) => {
    // eslint-disable-next-line
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      try {
        let emailExists = await axios.get('.netlify/functions/check-email', {
          params: {
            email: email
          }
        });

        emailExists = emailExists.data.existing;

        setIsValidEmail({
          valid: !emailExists,
          message: emailExists ? 'Email already exists!' : ''
        });

        return !emailExists;
      } catch (e) {
        setIsValidEmail({
          valid: false,
          message: 'Email already exists!'
        });

        return false;
      }
    } else {
      setIsValidEmail({
        valid: false,
        message: 'Invalid email address!'
      });

      return false;
    }
  };
  const validateUsername = async (username) => {
    if (username.trim() === '') {
      setIsValidUsername({
        valid: false,
        message: 'Invalid username!'
      });

      return false;
    }

    try {
      let usernameExists = await axios.get(
        '.netlify/functions/check-username',
        {
          params: {
            username: username
          }
        }
      );

      usernameExists = usernameExists.data.existing;

      setIsValidUsername({
        valid: !usernameExists,
        message: usernameExists ? 'Username already exists!' : ''
      });

      return !usernameExists;
    } catch (e) {
      setIsValidUsername({
        valid: false,
        message: 'Username already exists!'
      });

      return false;
    }
  };
  const validatePassword = (password) => {
    return password.trim() !== '';
  };
  const validateConfirmPassword = (password, confirmPassword) => {
    return (
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      password.trim() === confirmPassword.trim()
    );
  };
  const validateName = (name) => {
    return name.trim() !== '';
  };
  const validateContactNumber = (contactNumber) => {
    return contactNumber.trim() !== '';
  };
  const validateTelephoneNumber = (telephoneNumber) => {
    return telephoneNumber.trim() !== '';
  };
  const validateGender = (gender) => {
    return ['m', 'f'].includes(gender);
  };
  const validateAddress = (address) => {
    return address.trim() !== '';
  };
  const validateCity = (city) => {
    return city.trim() !== '';
  };
  const validateProvince = (province) => {
    return province.trim() !== '';
  };
  const uploadImage = (fileAttachment) => {
    let formData = new FormData();

    formData.append('upload_preset', 'zyasxaqc');
    formData.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
    formData.append('file', fileAttachment);

    setIsUploading(true);

    axios
      .post(`https://api.cloudinary.com/v1_1/alarme/upload`, formData)
      .then((res) => {
        setAttachmentURL(res.data.secure_url);
        setIsUploading(false);
      })
      .catch(() => {
        setIsUploading(false);
      });
  };
  const goToPersonalInformation = async () => {
    const validEmail = await validateEmail(emailAddress);
    const validUsername = await validateUsername(username);
    const validPassword = validatePassword(password);
    const validConfirmPassword = validateConfirmPassword(
      password,
      confirmPassword
    );

    if (
      !validEmail ||
      !validUsername ||
      !validPassword ||
      !validConfirmPassword
    ) {
      if (!validEmail) {
        emailAddressInputRef.current.classList.add('invalid');
        setEmailAddressHasChanged(true);
      }

      if (!validUsername) {
        usernameInputRef.current.classList.add('invalid');
        setUsernameHasChanged(true);
      }

      if (!validPassword) {
        passwordInputRef.current.classList.add('invalid');
        setPasswordHasChanged(true);
      }

      if (!validConfirmPassword) {
        confirmPasswordInputRef.current.classList.add('invalid');
        setConfirmPasswordHasChanged(true);
      }
    } else {
      stepperInstance.nextStep();
    }
  };
  const goToPersonalAddress = () => {
    const validFirstName = validateName(firstName);
    const validMiddleName = validateName(middleName);
    const validLastName = validateName(lastName);
    const validGender = validateGender(gender);
    const validContactNumber = validateContactNumber(contactNumber);
    const validTelephoneNumber = validateTelephoneNumber(telephoneNumber);

    if (
      !validFirstName ||
      !validMiddleName ||
      !validLastName ||
      !validGender ||
      !validContactNumber ||
      !validTelephoneNumber
    ) {
      if (!validFirstName) {
        firstNameInputRef.current.classList.add('invalid');
        setFirstNameHasChanged(true);
      }

      if (!validMiddleName) {
        middleNameInputRef.current.classList.add('invalid');
        setMiddleNameHasChanged(true);
      }

      if (!validLastName) {
        lastNameInputRef.current.classList.add('invalid');
        setLastNameHasChanged(true);
      }

      if (!validGender) {
        setGenderHasChanged(true);
      }

      if (!validContactNumber) {
        contactNumberInputRef.current.classList.add('invalid');
        setContactNumberHasChanged(true);
      }

      if (!validTelephoneNumber) {
        telephoneNumberInputRef.current.classList.add('invalid');
        setTelephoneNumberHasChanged(true);
      }
    } else {
      stepperInstance.nextStep();
    }
  };
  const register = () => {
    const validAddress = validateAddress(address);
    const validCity = validateCity(city);
    const validProvince = validateProvince(province);

    if (!validAddress || !validCity || !validProvince) {
      if (!validAddress) {
        addressInputRef.current.classList.add('invalid');
        setAddressHasChanged(true);
      }

      if (!validCity) {
        cityInputRef.current.classList.add('invalid');
        setCityHasChanged(true);
      }

      if (!validProvince) {
        provinceInputRef.current.classList.add('invalid');
        setProvinceHasChanged(true);
      }
    } else {
      if (!hasAgree) {
        // eslint-disable-next-line
        M.toast({ html: 'You have to agree with the terms and shits first!' });

        return;
      }

      const registerData = {
        user_username: username,
        user_email: emailAddress,
        user_password: password,
        user_fname: firstName,
        user_mname: middleName,
        user_lname: lastName,
        user_mobile: contactNumber,
        user_address: address,
        user_photo: attachmentURL,
        user_suffix: '',
        user_sex: 'm',
        user_telephone: telephoneNumber,
        user_vaccinated: '1',
        user_vtype: 'VACCINE',
        user_vdose: 'DOSE',
        issent_passcode: 0
      };
      setIsRegistering(true);
      axios
        .post('/.netlify/functions/register', registerData)
        .then((res) => {
          if (res.data.success) {
            // eslint-disable-next-line
            M.toast({
              html: 'Successfully registered!',
              displayLength: 2000
            });

            setTimeout(() => {
              navigate('/');
            }, 2000);
          } else {
            // eslint-disable-next-line
            M.toast({ html: res.data.error });
          }
          setIsRegistering(false);
        })
        .catch(() => {
          setIsRegistering(false);
          // eslint-disable-next-line
          M.toast({ html: 'Register failed!' });
        });
    }
  };

  return (
    <>
      <nav>
        <div
          className="nav-wrapper"
          style={{
            marginLeft: 10
          }}
        >
          <Link to="/" className="brand-logo">
            AlarMe
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>
              <Link to="/">Login</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container">
        <div className="col s12">
          <div className="row">
            <h1>Register to AlarMe</h1>
          </div>
          <ul className="stepper linear">
            <li className="step active" key={'basicAccountCredentials'}>
              <div className="step-title waves-effect">
                Basic Account Credentials
              </div>
              <div className="step-content">
                <div className="row">
                  <div className="input-field">
                    <input
                      id="emailAddress"
                      type="email"
                      className={[
                        !emailAddressHasChanged
                          ? ''
                          : isValidEmail.valid
                          ? 'valid'
                          : 'invalid'
                      ]}
                      value={emailAddress}
                      onChange={(e) => {
                        setEmailAddress(e.target.value.trim());
                        setEmailAddressHasChanged(true);
                      }}
                      ref={emailAddressInputRef}
                    />
                    <label htmlFor="emailAddress">Email Address</label>
                    {emailAddressHasChanged && !isValidEmail.valid && (
                      <span
                        className="helper-text"
                        data-error={isValidEmail.message}
                      ></span>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="input-field">
                    <input
                      id="username"
                      type="text"
                      className={[
                        !usernameHasChanged
                          ? ''
                          : isValidUsername.valid
                          ? 'valid'
                          : 'invalid'
                      ]}
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value.trim());
                        setUsernameHasChanged(true);
                      }}
                      ref={usernameInputRef}
                    />
                    <label htmlFor="username">Username</label>
                    {usernameHasChanged && !isValidUsername.valid && (
                      <span
                        className="helper-text"
                        data-error={isValidUsername.message}
                      ></span>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="input-field">
                    <input
                      id="password"
                      type="password"
                      className={[
                        !passwordHasChanged
                          ? ''
                          : validatePassword(password)
                          ? 'valid'
                          : 'invalid'
                      ]}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordHasChanged(true);
                      }}
                      ref={passwordInputRef}
                    />
                    <label htmlFor="password">Password</label>
                    {passwordHasChanged && !validatePassword(password) && (
                      <span
                        className="helper-text"
                        data-error="Invalid password!"
                      ></span>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="input-field">
                    <input
                      id="confirmPassword"
                      type="password"
                      className={[
                        !confirmPasswordHasChanged
                          ? ''
                          : validateConfirmPassword(password, confirmPassword)
                          ? 'valid'
                          : 'invalid'
                      ]}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setConfirmPasswordHasChanged(true);
                      }}
                      ref={confirmPasswordInputRef}
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    {confirmPasswordHasChanged &&
                      !validateConfirmPassword(password, confirmPassword) && (
                        <span
                          className="helper-text"
                          data-error="Password does not match!"
                        ></span>
                      )}
                  </div>
                </div>
                <div className="step-actions">
                  <button
                    className="waves-effect waves-dark btn"
                    onClick={goToPersonalInformation}
                    type="button"
                  >
                    NEXT
                  </button>
                </div>
              </div>
            </li>
            <li className="step" key={'personalInformation'}>
              <div className="step-title waves-effect">
                Personal Information
              </div>
              <div className="step-content">
                <div className="row">
                  <div className="input-field">
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      className={[
                        !firstNameHasChanged
                          ? ''
                          : validateName(firstName)
                          ? 'valid'
                          : 'invalid'
                      ]}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setFirstNameHasChanged(true);
                      }}
                      ref={firstNameInputRef}
                    />
                    <label htmlFor="firstName">First Name</label>
                    {firstNameHasChanged && !validateName(firstName) && (
                      <span
                        className="helper-text"
                        data-error="First name cannot be empty!"
                      ></span>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="input-field">
                    <input
                      id="middleName"
                      type="text"
                      value={middleName}
                      className={[
                        !middleNameHasChanged
                          ? ''
                          : validateName(middleName)
                          ? 'valid'
                          : 'invalid'
                      ]}
                      onChange={(e) => {
                        setMiddleName(e.target.value);
                        setMiddleNameHasChanged(true);
                      }}
                      ref={middleNameInputRef}
                    />
                    <label htmlFor="middleName">Middle Name</label>
                    {middleNameHasChanged && !validateName(middleName) && (
                      <span
                        className="helper-text"
                        data-error="Middle name cannot be empty!"
                      ></span>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="input-field">
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      className={[
                        !lastNameHasChanged
                          ? ''
                          : validateName(lastName)
                          ? 'valid'
                          : 'invalid'
                      ]}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setLastNameHasChanged(true);
                      }}
                      ref={lastNameInputRef}
                    />
                    <label htmlFor="lastName">Last Name</label>
                    {lastNameHasChanged && !validateName(lastName) && (
                      <span
                        className="helper-text"
                        data-error="Last name cannot be empty!"
                      ></span>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col s3 m2" style={{ paddingLeft: 0 }}>
                    <label>
                      <input
                        className="with-gap"
                        name="gender"
                        type="radio"
                        value={'m'}
                        onChange={(e) => {
                          setGender(e.target.value);
                        }}
                      />
                      <span>Male</span>
                    </label>
                  </div>
                  <div className="col s3 m2">
                    <label>
                      <input
                        className="with-gap"
                        name="gender"
                        type="radio"
                        value={'f'}
                        onChange={(e) => {
                          setGender(e.target.value);
                        }}
                      />
                      <span>Female</span>
                    </label>
                  </div>
                </div>
                <div className="row">
                  {genderHasChanged && !validateGender(gender) && (
                    <span
                      className="helper-text"
                      data-error="Gender cannot be empty!"
                      style={{
                        color: '#F44336',
                        fontSize: 12
                      }}
                    >
                      Gender cannot be empty!
                    </span>
                  )}
                </div>
                <div className="row">
                  <div className="input-field">
                    <input
                      id="contactNumber"
                      type="text"
                      value={contactNumber}
                      className={[
                        !contactNumberHasChanged
                          ? ''
                          : validateContactNumber(contactNumber)
                          ? 'valid'
                          : 'invalid'
                      ]}
                      onChange={(e) => {
                        setContactNumber(e.target.value);
                        setContactNumberHasChanged(true);
                      }}
                      ref={contactNumberInputRef}
                    />
                    <label htmlFor="contactNumber">Contact Number</label>
                    {contactNumberHasChanged &&
                      !validateContactNumber(contactNumber) && (
                        <span
                          className="helper-text"
                          data-error="Contact number cannot be empty!"
                        ></span>
                      )}
                  </div>
                </div>
                <div className="row">
                  <div className="input-field">
                    <input
                      id="telephoneNumber"
                      type="text"
                      value={telephoneNumber}
                      className={[
                        !telephoneNumberHasChanged
                          ? ''
                          : validateTelephoneNumber(telephoneNumber)
                          ? 'valid'
                          : 'invalid'
                      ]}
                      onChange={(e) => {
                        setTelephoneNumber(e.target.value);
                        setTelephoneNumberHasChanged(true);
                      }}
                      ref={telephoneNumberInputRef}
                    />
                    <label htmlFor="telephoneNumber">Telephone Number</label>
                    {telephoneNumberHasChanged &&
                      !validateTelephoneNumber(telephoneNumber) && (
                        <span
                          className="helper-text"
                          data-error="Telephone number cannot be empty!"
                        ></span>
                      )}
                  </div>
                </div>
                <div className="row">
                  <div className="file-field input-field">
                    <div className="btn">
                      <span>Photo</span>
                      <input
                        type="file"
                        onChange={(e) => {
                          uploadImage(e.target.files[0]);
                        }}
                      />
                    </div>
                    <div className="file-path-wrapper">
                      <input className="file-path validate" type="text" />
                    </div>
                  </div>
                </div>
                <div className="step-actions">
                  <button
                    className="waves-effect waves-dark btn light-blue accent-4"
                    onClick={() => stepperInstance.prevStep()}
                    type="button"
                  >
                    BACK
                  </button>
                  <button
                    className={`waves-effect waves-dark btn ${
                      isUploading ? 'disabled' : ''
                    }`}
                    onClick={goToPersonalAddress}
                    type="button"
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            </li>
            <li className="step" key={'personalAddress'}>
              <div className="step-title waves-effect">Personal Address</div>
              <div className="step-content">
                <div className="row">
                  <div className="input-field">
                    <select
                      onChange={(e) => {
                        setAddressStatus(e.target.value);
                      }}
                      value={addressStatus}
                    >
                      <option value="live">I live in the baranggay</option>
                      <option value="guest">
                        I am a guest in the baranggay
                      </option>
                    </select>
                    <label>Status</label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field">
                    <input
                      id="houseNoStreetName"
                      type="text"
                      value={address}
                      className={[
                        !addressHasChanged
                          ? ''
                          : validateAddress(address)
                          ? 'valid'
                          : 'invalid'
                      ]}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setAddressHasChanged(true);
                      }}
                      ref={addressInputRef}
                    />
                    <label htmlFor="houseNoStreetName">
                      House No. Street Name
                    </label>
                    {addressHasChanged && !validateAddress(address) && (
                      <span
                        className="helper-text"
                        data-error="Address cannot be empty!"
                      ></span>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="input-field">
                    <input
                      id="city"
                      type="text"
                      value={city}
                      className={[
                        !cityHasChanged
                          ? ''
                          : validateCity(city)
                          ? 'valid'
                          : 'invalid'
                      ]}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setCityHasChanged(true);
                      }}
                      ref={cityInputRef}
                    />
                    <label htmlFor="city">City</label>
                    {cityHasChanged && !validateCity(city) && (
                      <span
                        className="helper-text"
                        data-error="City cannot be empty!"
                      ></span>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="input-field">
                    <input
                      id="province"
                      type="text"
                      value={province}
                      className={[
                        !provinceHasChanged
                          ? ''
                          : validateProvince(province)
                          ? 'valid'
                          : 'invalid'
                      ]}
                      onChange={(e) => {
                        setProvince(e.target.value);
                        setProvinceHasChanged(true);
                      }}
                      ref={provinceInputRef}
                    />
                    <label htmlFor="province">Province</label>
                    {provinceHasChanged && !validateProvince(province) && (
                      <span
                        className="helper-text"
                        data-error="Province cannot be empty!"
                      ></span>
                    )}
                  </div>
                </div>
                <div className="row">
                  <label>
                    <input
                      type="checkbox"
                      className="filled-in"
                      onChange={(e) => {
                        setHasAgree(!hasAgree);
                      }}
                    />
                    <span>I have read and agreed to all the shit.</span>
                  </label>
                </div>
                <div className="step-actions">
                  <button
                    className="waves-effect waves-dark btn light-blue accent-4"
                    onClick={() => stepperInstance.prevStep()}
                    type="button"
                  >
                    BACK
                  </button>
                  <button
                    className={`waves-effect waves-dark btn ${
                      isRegistering ? 'disabled' : ''
                    }`}
                    onClick={() => register()}
                    type="button"
                  >
                    REGISTER
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
