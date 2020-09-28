{
    'name': 'History Price POS',
    'author': 'technoindo.com',
    'category': 'hidden',
    'version': '10.0',
    'summary': 'Summary the addon.',
    'description': '''Description the addon'''
                   ,
    'depends': ['point_of_sale'],
    'data': [
        'views/pos_history_template.xml'
    ],
    'qweb': [
        'static/src/xml/history_price.xml',
    ],
    'images': [''],
    'auto_install': False,
    'installable': True,
    'application': False,
}