INSERT INTO public.account(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES(
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony';
DELETE FROM public.account
WHERE account_firstname = 'Tony';
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
SELECT c.classification_name,
    i.inv_model
FROM classification c
    INNER JOIN inventory i ON i.classification_id = c.classification_id
WHERE c.classification_id = 2;
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/');
UPDATE public.inventory
SET inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');