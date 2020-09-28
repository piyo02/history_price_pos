odoo.define('history_price_pos.screens', function (require) {
    "use strict";
    
    var models = require('point_of_sale.models');
    var screens = require('point_of_sale.screens');
    var Model = require("web.Model");
    var core = require('web.core');
    var _t = core._t;

    var historyPriceButton = screens.ActionButtonWidget.extend({
        template: 'historyPriceButton',
        button_click: function(){
            var self = this;
            var order = this.pos.get_order()
            if (order) {
                var selected_orderline = order.selected_orderline;
                if (selected_orderline) {
                    var product = selected_orderline.product;
                    var partner = order.attributes.client;
                    
                    var partner_filter = partner == null ? ["order_id.partner_id", "=", false] : ["order_id.partner_id.id", "=", partner.id];

                    new Model("pos.order.line")
                        .query(['name', 'order_id', 'order_id.partner_id', 'product_id', 'price_unit'])
                        .filter([["product_id.id", "=", product.id], partner_filter])
                        .all()
                        .then(
                            function(orders) {
                                if(orders && orders.length){
                                    var list = []
                                    for (let index = 0; index < orders.length; index++) {
                                        list.push({
                                            'label': `${orders[index].product_id[1]}: Rp.${orders[index].price_unit}`,
                                            'item': orders[index]
                                        })
                                    }
                                    return self.gui.show_popup('selection', {
                                        title: _t('Histori Harga Jual'),
                                        list: list,
                                        confirm: function (item) {
                                            selected_orderline.set_unit_price(item['price_unit'])
                                            selected_orderline.price_unit = item['price_unit'];
                                            selected_orderline.trigger('change', selected_orderline);
                                            selected_orderline.trigger('update:OrderLine');
                                        }
                                    });
                                } else {
                                    return self.gui.show_popup('alert', {
                                        title: _t('Histori Harga Jual'),
                                        body: 'Produk ini belum pernah dibeli oleh Pelanggan',
                                    });
                                }
                            },
                            function(err, event) {
                                event.preventDefault();
                                console.error(err);
                                return self.gui.show_popup("error", {
                                    title: _t("Error: Could not find the Order"),
                                    body: err.data,
                                });
                            }
                        );
                } else {
                    return self.pos.gui.show_popup('error', {
                        title: '!!! Warning !!!',
                        body: 'Please select line want show the history sale'
                    });
                }
            } else {
                return self.pos.gui.show_popup('error', {
                    title: '!!! Warning !!!',
                    body: 'Order null'
                });
            }
        },
    
    });
    
        screens.define_action_button({
            'name': 'historyPrice',
            'widget': historyPriceButton,
        });
    });