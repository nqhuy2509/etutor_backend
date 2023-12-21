export const responseCode = {
    some_things_went_wrong: '0000',
    auth: {
        register: {
            user_already_exists: '1001',
            username_already_exists: '1002',
        },
        login: {
            invalid_credentials: '1101',
            user_is_not_verify: '1102',
            user_is_not_active: '1103',
            user_is_suspended: '1104',
            update_password: '1105',
        },
    },
};
