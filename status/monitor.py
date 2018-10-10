#!/usr/bin/env python3

import datetime
import json
import requests
import time
from notify_run import Notify
from pid import PidFileAlreadyLockedError
from pid.decorator import pidfile
from config import config


class StatusMonitor:


    def __init__(self):
        self.server_url = config['server_url']
        self.api_path = '/status-json.xsl'
        self.notification_interval = datetime.timedelta(minutes=30) 
        self.poll_interval_seconds = 10
        self.popularity_threshold = 1 # Send notifications if listener count is above this
        self.last_notified = datetime.datetime.now() - datetime.timedelta(minutes=60)
        self.notifier = Notify()
        self.update()
 
    def update(self):
        self.page_response = requests.get(self.server_url + self.api_path)
        self.stats = json.loads(self.page_response.text)
        self.listeners = self.stats['icestats']['source']['listeners']

        time_since_last_notif = datetime.datetime.now() - self.last_notified
        due = time_since_last_notif > self.notification_interval
        popular = self.listeners >= self.popularity_threshold
        print('due {}, popular {}'.format(due, popular))
        if due and popular:
            # Dispatch notification
            print('sending listener count notification')
            self.notifier.send('There are {} listeners'.format(self.listeners))
            self.last_notified = datetime.datetime.now()

    def poll(self):
        while 1 == 1: 
            self.update()
            print(
                'There are currently {} people listening.'.format(
                    self.listeners
                )
            )
            time.sleep(self.poll_interval_seconds)

@pidfile(piddir=config['lockfile'])
def main():
    monitor = StatusMonitor()
    print('sending startup notif')
    monitor.notifier.send('HPR - Activated stream monitor')
    try:
        monitor.poll()
    except KeyboardInterrupt:
        print('\nExiting.')




if __name__ == '__main__':
    try:
        main()
    except PidFileAlreadyLockedError:
        print(config['server_url'])
        print('Status monitor is already running. Exiting.')

else:
    m = StatusMonitor()

 
